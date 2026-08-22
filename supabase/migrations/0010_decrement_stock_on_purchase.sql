-- Stock was never actually decremented when an order was paid — a
-- product's `stock` count stayed frozen at whatever the admin last set it
-- to, no matter how many orders went through for it. Called once per order
-- line item from the Stripe webhook (checkout.session.completed, see
-- src/app/api/webhooks/stripe/route.ts) via db.rpc(), so the decrement is a
-- single atomic UPDATE (safe under concurrent purchases of the same
-- product) instead of a read-then-write from application code. Clamped at
-- 0 so it can never go negative.
create function public.decrement_product_stock(p_product_id uuid, p_quantity integer)
returns void
language sql
as $$
  update public.products
  set stock = greatest(stock - p_quantity, 0)
  where id = p_product_id;
$$;
