-- Orders sat in 'pending' forever once a customer backed out of Stripe
-- Checkout or just abandoned the tab — there was no status for "this
-- checkout didn't happen" to move them into. Add 'cancelled' alongside
-- the existing statuses.
alter table public.orders
  drop constraint orders_status_check;

alter table public.orders
  add constraint orders_status_check check (
    status in ('pending', 'paid', 'shipped', 'refunded', 'cancelled')
  );
