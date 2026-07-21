# Hot Vitality

E-commerce store for dietary supplements.

## Stack

- Next.js 14 (App Router) + TypeScript
- Shadcn UI (Base UI primitives) + Tailwind CSS v4
- Supabase (backend/DB — not wired up yet)
- Stripe (payments — not wired up yet)
- Cloudinary (image hosting — not wired up yet)
- Resend (transactional email — not wired up yet)

## Conventions

- Write clean, readable code with comments explaining what each part does — the developer is learning.
- All components must be responsive, built mobile-first.
- Current phase: **UI only**. Do not add backend/API logic (Supabase, Stripe, Cloudinary, Resend) until explicitly asked.

## Notes on the setup

- Colors and border radius live as CSS variables in `src/app/globals.css`
  (`:root` for light mode, `.dark` for dark mode) and are mapped to Tailwind
  utility classes (`bg-primary`, `text-foreground`, etc.) via the
  `@theme inline` block at the top of that file. To change the brand
  palette, edit the variables in `:root` — you don't need to touch any
  component code.
- Product data is mocked in `src/data/products.ts` and cart data in
  `src/data/cart.ts`. Both are typed against `src/lib/types.ts`. When
  Supabase is added later, these files get replaced by real queries but
  the shape (`Product`, `CartItem`) should stay the same so components
  don't need to change.
- Product images are temporary Unsplash stock photos referenced by URL —
  swap them for real product photos hosted on Cloudinary once that's set
  up (remember to add Cloudinary's hostname to `images.remotePatterns` in
  `next.config.mjs`).
- The WhatsApp contact button (`src/components/layout/whatsapp-button.tsx`)
  has a placeholder phone number — replace `WHATSAPP_PHONE_NUMBER` with
  the real business number before launch.
