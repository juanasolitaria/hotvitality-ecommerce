# HotVitality

E-commerce store for dietary supplements.

> Brand name is one word: **HotVitality**, not "Hot Vitality". Use it that way in all
> user-facing text, titles, and copy (the `hot-vitality.com` email domain and the
> `hot-vitality` npm package name are the only exceptions, since those can't contain spaces).

## Stack

- Next.js 14 (App Router) + TypeScript
- Shadcn UI (Base UI primitives) + Tailwind CSS v4
- Supabase — Postgres database, Auth, and Storage (product images), all wired up and in use
- Stripe Checkout — real payments, wired up
- Resend — transactional email, wired up (order confirmations; also handles Supabase Auth's own emails via custom SMTP)

Nothing above is a placeholder anymore — every service is connected and being used with real (if still test/sandbox-mode) credentials in `.env.local`.

## How the pieces fit together

**Storefront → checkout → payment.** The cart lives in `localStorage` only
(`src/lib/cart-context.tsx`) — no DB table, no login required to add items.
At checkout (`src/app/(storefront)/checkout/actions.ts`), `createCheckoutSession`
re-looks-up every product's price server-side (never trusts the client), writes a
`pending` order + its `order_items` to Supabase, then opens a Stripe Checkout
Session and redirects the customer there. Stripe hosts the actual payment page —
card details never touch our server. The form also requires a required Terms/
Privacy checkbox (enforced again server-side, not just via the form's
`required`) and offers an optional, unchecked-by-default SMS marketing opt-in —
both get recorded on the order (`terms_accepted`, `sms_marketing_consent`).

**Confirming payment.** Stripe redirects back to `/checkout/success?session_id=...`,
which verifies the session with Stripe before showing anything (never trusts the
URL alone). The order is only marked `paid` by the Stripe webhook
(`src/app/api/webhooks/stripe/route.ts`, `checkout.session.completed`), which also
fires the order-confirmation email (`src/lib/email/order-confirmation.ts`) and a
Telegram notification to the admin group (`src/lib/telegram.ts`) as best-effort
side effects — failures are logged, not thrown, so they can't turn into a Stripe
webhook retry loop.

**Shipping a paid order.** `status` (`paid`/`cancelled`/`pending`/etc.) means
exactly what it always has and never changes to `shipped` — what's new is a
`tracking_number` column, set via an "Insert Tracking Number" button on
`/admin/orders/[id]` (shown once an order is `paid` and has no tracking number
yet), backed by `setTrackingNumber` in `src/app/admin/orders/actions.ts` (gated by
its own `requireAdmin()` check, unlike `admin/products/actions.ts`, see Known
gaps). Submitting it only sets `tracking_number` and emails it to the customer
(`src/lib/email/shipping-confirmation.ts`, which also best-effort-guesses the
carrier — UPS/USPS/FedEx — from the tracking number's format via
`src/lib/shipping-carrier.ts`, and links to that carrier's tracking page) —
unlike the webhook-triggered emails, this one throws on failure so the admin
actually sees it. Whether an order counts as "shipped" is read from
`tracking_number` being non-null, not from `status` — see `getShippingStatus` in
`src/components/admin/order-status-badge.tsx`, used for the "Shipping Status"
column on `/admin/orders` ("Awaiting label" for a `paid` order with no tracking
number yet, "Shipped" once it has one). `awaiting_shipping_label`/`shipped` still
exist in `OrderStatus`/the DB constraint for flexibility, but nothing writes them
automatically.

**Cancelling/abandoning checkout.** An order shouldn't sit on `pending`
forever just because the customer didn't pay. If they click Stripe's own
"back to store" link, `cancel_url` sends them to
`/checkout?canceled=true&session_id=...`, and the checkout page
(`checkout/page.tsx`) marks that order `cancelled` right there (only if
it's still `pending` and Stripe confirms it wasn't paid). The browser's
own Back button is *not* equivalent to this — Stripe Checkout pushes its
own internal steps into browser history, so a native back-button press
can land back on our pre-payment `/checkout` page (no `session_id` at
all) instead of `cancel_url`, and nothing gets cancelled in that case.
That's expected and not worth chasing (verified by testing — it depends
on Stripe's own front-end history, not our code). The real safety net for
every abandonment path (browser back, closing the tab, walking away) is
`checkout/actions.ts` setting `expires_at` to 30 minutes on the session —
Stripe's own minimum for that field — plus the webhook's
`checkout.session.expired` handler, so worst case an unpaid order becomes
`cancelled` within half an hour either way.

**Guest orders vs. RLS.** Guest checkout is allowed (`orders.user_id` nullable).
Both the checkout action and the webhook use a service-role Supabase client
(bypasses Row Level Security) because there's no user session to check against —
see the comments at the top of `checkout/actions.ts` and the webhook route for why
that's safe here.

**Admin dashboard** (`/admin/*`) is gated in `src/app/admin/layout.tsx`: not logged
in → redirect to login; logged in but `profiles.role !== 'admin'` → redirect home.
Covers products (CRUD + drag-and-drop image upload to the `product-images` Storage
bucket), users, and orders across two pages: `/admin/payments` (revenue-focused —
counts `paid`/`awaiting_shipping_label`/`shipped` orders as revenue) and
`/admin/orders` (fulfillment-focused — click into `/admin/orders/[id]` for the full
shipping address, phone, and line items, each with its own copy-to-clipboard button
for pasting into PirateShip, plus a shortcut button there to buy the shipping label
and, once paid, the "Insert Tracking Number" button described in "Shipping a paid
order" above). The dashboard's "Recent Orders" table also links straight into the
same detail pages. `refunded` is still a dead end — nothing in the UI writes it,
see Known gaps.

**Auth.** Login/signup is one modal (`src/components/layout/auth-modal.tsx`)
reachable from anywhere via `useAuthModal()`. `src/middleware.ts` refreshes the
Supabase session on every request. Password-reset and email-confirmation links land
on `src/app/auth/confirm/route.ts`, which verifies the token and sets the session
cookie.

## Known gaps

- **`refunded` is a dead end.** Nothing in the UI moves an order to
  `refunded`, even though `OrderStatus` supports it (`paid` → `shipped` is now
  wired up, see "Shipping a paid order" above; `pending`→`cancelled` is
  automatic, see "Cancelling/abandoning checkout" above that).
- **Some admin Server Actions only check auth at the page level.**
  `admin/layout.tsx` gates every `/admin` *page*, but `admin/products/actions.ts`
  (`saveProduct`, `deleteProduct`, `uploadProductImages`) doesn't independently
  verify the caller is an admin — it relies on the fact that only the gated
  admin UI calls it. Server Actions are reachable as their own endpoint, so this
  should get an explicit admin check before this goes live — `admin/orders/actions.ts`'s
  `requireAdmin()` is the pattern to copy over.
- No automated tests yet.

## Conventions

- Write clean, readable code with comments explaining what each part does — the developer is learning.
- All components must be responsive, built mobile-first.
- Don't add new third-party services without discussing first — Supabase, Stripe, and Resend cover the stack; no Cloudinary (images went to Supabase Storage instead).

## Notes on the setup

- Colors and border radius live as CSS variables in `src/app/globals.css`
  (`:root` for light mode, `.dark` for dark mode) and are mapped to Tailwind
  utility classes (`bg-primary`, `text-foreground`, etc.) via the
  `@theme inline` block at the top of that file. To change the brand
  palette, edit the variables in `:root` — you don't need to touch any
  component code.
- Product and order data come from Supabase — see `src/lib/supabase/{products,orders,users}.ts`.
  Both are typed against `src/lib/types.ts` (`Product`, `CartItem`, `Order`, `StoreUser`).
- Product images are uploaded through the admin panel
  (`src/components/admin/image-dropzone.tsx` → `uploadProductImages` Server Action)
  straight into the Supabase Storage `product-images` bucket (public, so
  `next/image` and customers' browsers can load them directly). A few older
  products may still reference Unsplash stock photo URLs — both hostnames are
  allowed in `images.remotePatterns` in `next.config.mjs`.
- Required env vars live in `.env.local` (never commit real values):
  `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
  `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`,
  `RESEND_API_KEY`, `NEXT_PUBLIC_SITE_URL`. These are only set locally right now —
  nothing has been deployed, so nothing is configured in Vercel (or wherever this
  ends up hosted) yet.
- Supabase Auth's own emails (signup confirmation, password reset) go out through
  Resend too, via custom SMTP configured in the Supabase dashboard
  (Authentication → Settings → SMTP Settings) — not through `src/lib/resend.ts`
  directly, that file is only for order confirmations sent from application code.
- Database schema changes live as numbered files in `supabase/migrations/`, run
  manually in the Supabase SQL Editor (no CLI/migration runner wired up) — bump
  the number for any new change (`0008_...sql`, etc). Latest is
  `0007_awaiting_shipping_label.sql` (adds `'awaiting_shipping_label'` to the
  `orders_status_check` constraint and `orders.tracking_number`) — if you're
  seeing "violates check constraint orders_status_check" on an order you just
  tried to mark awaiting a label, this migration hasn't been run against that
  Supabase project yet.
- In dev, testing from a phone/other device requires the LAN IP in
  `next.config.mjs`'s `experimental.serverActions.allowedOrigins` (Next
  rejects Server Action requests from origins it doesn't recognize) — update
  it if the machine's IP changes.
