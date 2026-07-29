-- Stripe needs somewhere to store which Checkout Session / Payment Intent
-- paid for a given order, so the webhook can find the right row to mark
-- as paid and so we can look an order back up later if we ever need to
-- issue a refund through the Stripe dashboard/API.
alter table public.orders
  add column stripe_session_id text,
  add column stripe_payment_intent_id text;

create unique index orders_stripe_session_id_idx
  on public.orders (stripe_session_id)
  where stripe_session_id is not null;
