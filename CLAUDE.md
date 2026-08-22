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
decrements `products.stock` for each line item (via the `decrement_product_stock`
Postgres function, `supabase/migrations/0010_decrement_stock_on_purchase.sql` —
a single atomic `UPDATE`, clamped at 0, called once per item through `db.rpc()`
so concurrent purchases of the same product can't race each other), fires the
order-confirmation email (`src/lib/email/order-confirmation.ts`), and a Telegram
notification to the admin group (`src/lib/telegram.ts`) as best-effort side
effects — failures are logged, not thrown, so they can't turn into a Stripe
webhook retry loop (the `.eq("status", "pending")` idempotency guard means a
redelivered event wouldn't retry any of this anyway, since `order` comes back
null once the order is no longer `pending`).

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

**Contact form.** `/contact` (`src/components/contact/contact-form.tsx`) emails
the message straight to `hotvitality@gmail.com` via Resend
(`src/lib/email/contact-message.ts`, `sendContactMessage` in
`contact/actions.ts`) — nothing is stored in the database, the email itself is
the record, and it sets `replyTo` to the sender's address so replying in an
email client goes straight to them. User-supplied fields are HTML-escaped
before going into the email (this one lands in the *admin's* inbox, unlike the
customer-facing templates, so unescaped input would be a real injection risk,
not just self-XSS). Rate-limited by IP the same way as checkout — see below.

**Anonymous-input rate limiting.** Both checkout (`createCheckoutSession`) and
the contact form share `checkIpRateLimit`/`getClientIp` in `src/lib/rate-limit.ts`:
best-effort, counts recent rows from the same IP in a given table
(`orders.client_ip` / `contact_rate_limits.client_ip`) and rejects once a
threshold is hit. A determined attacker can rotate IPs — this only raises the
bar against casual scripted abuse, see Known gaps.

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
- No automated tests yet.
- **Rate limiting is best-effort only.** `checkIpRateLimit` (`src/lib/rate-limit.ts`)
  caps repeated checkout attempts (5 per 10 min) and contact-form submissions (3
  per 10 min) per IP, but a determined attacker can just rotate IPs — this raises
  the bar against casual scripted abuse, it isn't real bot protection. A proper
  fix (Turnstile/hCaptcha or similar) would be a new third-party service, worth
  discussing before adding.

## Security review history

A full pass (2026-08-19) found and fixed three real issues, in order of
severity:

1. **Critical — self-promotion to admin.** `profiles_update_own`
   (`0001_init.sql`) let any logged-in user update their own `profiles` row —
   RLS restricts which *rows* you can touch, not which *columns*, so nothing
   stopped that same update from also setting `role: 'admin'`. Fixed in
   `0008_security_hardening.sql` with a `before update` trigger
   (`prevent_role_self_escalation`) that rejects any `role` change unless the
   session making it is already an admin. Nothing in the app updates `role`
   today (`/admin/users` is read-only), so this doesn't affect any real
   feature.
2. **High — fake orders via the public anon key.** `orders_insert_own_or_guest`
   and `order_items_insert_via_order` (`0001_init.sql`) let *anyone*, no login
   required, insert arbitrary "order" rows straight through Supabase's REST
   API with the public anon key — any price, any items, no real product link,
   no payment. The app itself never used these policies (every real write
   goes through a service-role client, see "Guest orders vs. RLS" above), so
   they were pure attack surface. Dropped in `0008_security_hardening.sql`.
3. **Medium — admin Server Actions only checked auth at the page level.**
   `admin/layout.tsx` gates every `/admin` *page*, but `admin/products/actions.ts`
   (`saveProduct`, `deleteProduct`, `uploadProductImages`) didn't independently
   verify the caller was an admin — Server Actions are reachable as their own
   endpoint regardless of which page rendered the button that called them.
   Fixed by adding the same `requireAdmin()` check `admin/orders/actions.ts`
   already used.

Also hardened as defense-in-depth, not in response to a specific exploit:
`checkout/actions.ts` now validates cart quantities are whole numbers between
1–99 (previously unvalidated — a negative or absurd quantity would only have
been caught by a DB check constraint, after already reaching Stripe pricing
math), and added the per-IP checkout rate limit noted above (see Known gaps
for its limits). Migration `0008_security_hardening.sql` needs to be run in
the Supabase SQL Editor for any of this to take effect.

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
  `RESEND_API_KEY`, `NEXT_PUBLIC_SITE_URL`, `TELEGRAM_BOT_TOKEN`,
  `TELEGRAM_CHAT_ID` (the last two are only read by `src/lib/telegram.ts` —
  missing them doesn't break anything else, `sendAdminOrderNotification`
  just logs and skips sending). Deployed to Vercel as of 2026-08-20
  (`hotvitality.vercel.app`, live Stripe keys) — the custom domain
  (`hot-vitality.com`) isn't pointed at it yet, so `NEXT_PUBLIC_SITE_URL`
  is temporarily set to the `vercel.app` URL until that DNS cutover
  happens (see "Pending reminders" project memory for the full deploy
  checklist).
- Supabase Auth's own emails (signup confirmation, password reset) go out through
  Resend too, via custom SMTP configured in the Supabase dashboard
  (Authentication → Settings → SMTP Settings) — not through `src/lib/resend.ts`
  directly, that file is only for order confirmations sent from application code.
- Database schema changes live as numbered files in `supabase/migrations/`, run
  manually in the Supabase SQL Editor (no CLI/migration runner wired up) — bump
  the number for any new change (`0011_...sql`, etc). Latest is
  `0010_decrement_stock_on_purchase.sql` (adds the `decrement_product_stock`
  function the webhook calls to actually reduce `products.stock` on a paid
  order — see "Confirming payment" above; before this migration ran, stock
  never moved no matter how many orders went through). Before that,
  `0009_contact_form.sql` (adds `contact_rate_limits`, used only for rate
  limiting the contact form — see "Contact form" above). Before that,
  `0008_security_hardening.sql` (see "Security review history" above — drops
  the exploitable anon-insert policies on `orders`/`order_items`, adds
  `orders.client_ip` for rate limiting, and adds a trigger blocking non-admins
  from changing `profiles.role`), and before that `0007_awaiting_shipping_label.sql`
  adds `'awaiting_shipping_label'` to the `orders_status_check` constraint and
  `orders.tracking_number` — if you're seeing "violates check constraint
  orders_status_check" on an order you just tried to mark awaiting a label,
  that one hasn't been run against that Supabase project yet.
- In dev, testing from a phone/other device requires the LAN IP in
  `next.config.mjs`'s `experimental.serverActions.allowedOrigins` (Next
  rejects Server Action requests from origins it doesn't recognize) — update
  it if the machine's IP changes.
