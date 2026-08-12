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
fires the order-confirmation email (`src/lib/email/order-confirmation.ts`) as a
best-effort side effect — a Resend failure is logged, not thrown, so it can't turn
into a Stripe webhook retry loop.

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
only counts `paid`/`shipped` orders as revenue) and `/admin/orders` (fulfillment-
focused — click into `/admin/orders/[id]` for the full shipping address, phone, and
line items, each with its own copy-to-clipboard button for pasting into
PirateShip, plus a shortcut button there to buy the shipping label). The
dashboard's "Recent Orders" table also links straight into the same detail
pages. All of this is still **read-only** on status, see Known gaps.

**Auth.** Login/signup is one modal (`src/components/layout/auth-modal.tsx`)
reachable from anywhere via `useAuthModal()`. `src/middleware.ts` refreshes the
Supabase session on every request. Password-reset and email-confirmation links land
on `src/app/auth/confirm/route.ts`, which verifies the token and sets the session
cookie.

## Known gaps

- **No new-order notification for the admin.** The admin wants a WhatsApp
  message to their personal number the moment an order comes in (`paid`),
  instead of having to keep checking `/admin/orders`. Needs the WhatsApp
  Business Platform (Cloud API) — this is a new third-party service, so
  worth confirming the approach before wiring it up. The natural trigger
  point is the same place as the confirmation email, in the webhook's
  `checkout.session.completed` handler (`src/app/api/webhooks/stripe/route.ts`).
- **Order status is a dead end past `paid`.** Neither `/admin/payments` nor
  `/admin/orders` has a UI to move an order `paid` → `shipped` → `refunded`,
  even though `OrderStatus` supports all five states (`pending`, `paid`,
  `shipped`, `refunded`, `cancelled` — `pending`→`cancelled` is now automatic,
  see above). Also means: no "your order shipped" email exists yet — needs a
  trigger point once a shipping label / fulfillment step exists, plus a new
  email template alongside `order-confirmation.ts`.
- **Admin Server Actions only check auth at the page level.** `admin/layout.tsx`
  gates every `/admin` *page*, but the Server Actions themselves
  (`admin/products/actions.ts`: `saveProduct`, `deleteProduct`,
  `uploadProductImages`) don't independently verify the caller is an admin — they
  rely on the fact that only the gated admin UI calls them. Server Actions are
  reachable as their own endpoint, so this should get an explicit admin check
  before this goes live.
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
  the number for any new change (`0007_...sql`, etc). Latest is
  `0006_checkout_consent.sql` (adds `orders.terms_accepted` and
  `orders.sms_marketing_consent`) — if you're seeing "violates check
  constraint orders_status_check" on a cancelled order, `0005_order_cancelled_status.sql`
  hasn't been run against that Supabase project yet either.
- In dev, testing from a phone/other device requires the LAN IP in
  `next.config.mjs`'s `experimental.serverActions.allowedOrigins` (Next
  rejects Server Action requests from origins it doesn't recognize) — update
  it if the machine's IP changes.
