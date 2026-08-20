-- Security review, 2026-08-19.

-- Every order/order_item write in the app goes through a service-role
-- client (see the comments at the top of checkout/actions.ts, the Stripe
-- webhook route, and admin/orders/actions.ts) — RLS is deliberately
-- bypassed there, since guest checkout has no session to check prices or
-- ownership against. That means these two INSERT policies were never
-- actually used by the app itself, but were still reachable by anyone
-- using the public anon key directly against Supabase's REST API: the
-- `orders_insert_own_or_guest` policy's `user_id is null` clause let
-- literally anyone (no login required) insert a fake "order" row with any
-- price and no real payment, and `order_items_insert_via_order` let them
-- attach fabricated line items to it. Drop both — only the service-role
-- client can create orders/order_items now.
drop policy "orders_insert_own_or_guest" on public.orders;
drop policy "order_items_insert_via_order" on public.order_items;

-- Lets checkout/actions.ts rate-limit repeated checkout attempts from the
-- same IP (see createPendingOrder) — nothing currently stops a script
-- from calling that Server Action in a loop to flood the table with junk
-- pending orders and Stripe Checkout Sessions.
alter table public.orders
  add column client_ip inet;

-- `profiles_update_own` (0001_init.sql) lets a user update their own
-- profile row — needed so e.g. a customer can edit their own name. RLS
-- policies restrict which ROWS you can touch, not which COLUMNS, so
-- nothing stopped that same update from also including `role: 'admin'`,
-- self-promoting a regular customer to a full admin account. Nothing in
-- the app currently updates `role` at all (no admin/users UI does this
-- yet — it's read-only), so this trigger blocks every `role` change that
-- doesn't come from an already-admin session, closing the hole without
-- affecting any real feature today.
create function public.prevent_role_self_escalation()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.role is distinct from old.role and not public.is_admin() then
    raise exception 'Only an admin can change a profile''s role.';
  end if;
  return new;
end;
$$;

create trigger prevent_role_self_escalation
  before update on public.profiles
  for each row execute procedure public.prevent_role_self_escalation();
