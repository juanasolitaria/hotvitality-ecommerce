# HotVitality

An e-commerce storefront for dietary supplements, built with Next.js and a
real (if still sandbox-mode) backend: Supabase for data and auth, Stripe for
payments, Resend for email.

It's a working store, not a demo — checkout goes through actual Stripe
Checkout, orders land in Postgres, and customers get a real confirmation
email once payment clears.

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Supabase** — Postgres database, authentication, and file storage for
  product images
- **Stripe Checkout** — payment processing
- **Resend** — transactional email (order confirmations, plus Supabase
  Auth's signup/password-reset emails via SMTP)
- **Tailwind CSS v4** + Shadcn UI (built on Base UI primitives)

## How it's put together

The cart lives entirely in the browser (`localStorage`) — no account needed
to add items or check out as a guest. When a customer checks out, the server
re-prices everything from the database (the cart in the browser is never
trusted), writes a pending order, and hands off to Stripe. Stripe's webhook
is the only thing that ever marks an order as paid, and that same webhook
kicks off the confirmation email — the success page you land on after paying
is just a receipt, not the source of truth.

The admin dashboard (`/admin`) is gated by role, not just a login check —
only accounts with `role = 'admin'` in the `profiles` table get past the
layout guard. From there you can manage products (including drag-and-drop
image uploads straight to Supabase Storage), see orders and revenue, and
look at registered users.

## Running it locally

You'll need accounts with Supabase, Stripe, and Resend, and a `.env.local`
with:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
RESEND_API_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Then:

```bash
npm install
```

Run the SQL files in `supabase/migrations/` (in order) through the Supabase
SQL Editor to set up the schema, storage bucket, and row-level security
policies. `supabase/seed.sql` will give you some sample products to work
with.

To receive Stripe webhooks locally, forward them with the Stripe CLI:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Then start the app:

```bash
npm run dev
```

and open [http://localhost:3000](http://localhost:3000).

## Project layout

- `src/app/(storefront)` — the public site: home, shop, product pages, cart,
  checkout, account
- `src/app/admin` — the admin dashboard
- `src/app/api/webhooks/stripe` — the Stripe webhook handler
- `src/lib/supabase` — database queries, grouped by resource
- `src/lib/email` — email templates and senders
- `supabase/migrations` — schema changes, applied manually and in order

## Status

This hasn't been deployed anywhere yet — everything above runs against test
mode / sandbox credentials for Stripe and Resend. A few things are still
open before it's launch-ready: order status has no way to move past "paid"
from the admin dashboard, a handful of footer links don't have pages behind
them yet, and the WhatsApp contact button still has a placeholder number.
