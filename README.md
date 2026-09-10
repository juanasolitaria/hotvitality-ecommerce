# HotVitality

An e-commerce storefront for dietary supplements, built with Next.js and a
real (if still sandbox-mode) backend: Supabase for data and auth, Stripe for
payments, Resend for email.

It's a working store, not a demo — checkout goes through actual Stripe
Checkout, orders land in Postgres, and customers get a real confirmation
email once payment clears.

## Screenshots and GIF

*Home/Storefront*
<img width="2547" height="1315" alt="home" src="https://github.com/user-attachments/assets/f1032dae-3960-4a19-91da-d6da11e92430" />

*Google Places API for Address Autocomplete*
<img width="1280" height="720" alt="thing-ezgif com-video-to-gif-converter" src="https://github.com/user-attachments/assets/f96e0300-9f85-4584-ac6c-9266ef8423d5" />

*Admin Dashboard*
<img width="2555" height="1208" alt="Admin dashboard" src="https://github.com/user-attachments/assets/11e6409b-c33b-4ca2-a356-ce29a275106a" />

*Cart*
<img width="1558" height="1020" alt="cart" src="https://github.com/user-attachments/assets/5bc451a6-480e-40e0-8eff-6a7701e77817" />

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

## Project layout

- `src/app/(storefront)` — the public site: home, shop, product pages, cart,
  checkout, account
- `src/app/admin` — the admin dashboard
- `src/app/api/webhooks/stripe` — the Stripe webhook handler
- `src/lib/supabase` — database queries, grouped by resource
- `src/lib/email` — email templates and senders
- `supabase/migrations` — schema changes, applied manually and in order


