-- Adds tracking_number, filled in once the admin inserts it on
-- /admin/orders/[id] (src/app/admin/orders/actions.ts, setTrackingNumber),
-- which moves a 'paid' order straight to 'shipped' and fires the
-- shipping-confirmation email. 'paid'/'pending'/'cancelled' are untouched —
-- 'awaiting_shipping_label' is added to the constraint for flexibility, but
-- nothing writes it automatically; the admin UI treats a 'paid' order the
-- same as one already in that status (see CLAUDE.md's "Shipping a paid
-- order").
alter table public.orders
  drop constraint orders_status_check;

alter table public.orders
  add constraint orders_status_check check (
    status in ('pending', 'paid', 'awaiting_shipping_label', 'shipped', 'refunded', 'cancelled')
  );

alter table public.orders
  add column tracking_number text;
