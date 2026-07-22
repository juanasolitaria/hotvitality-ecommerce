-- Hot Vitality — seed data
-- Run this in the Supabase SQL Editor after 0001_init.sql and 0002_drop_category.sql.
-- Same products as src/data/products.ts, so the storefront looks identical
-- once we switch it over to read from Supabase.

-- `on conflict (slug) do nothing` at the end makes this safe to run more
-- than once — it won't error or duplicate rows if these slugs already exist.
insert into public.products (slug, name, short_description, description, price, images, stock)
values
  (
    'multivitamin-daily',
    'Multivitamin Daily',
    'A complete daily blend of essential vitamins.',
    'Multivitamin Daily covers your everyday nutritional bases with 23 essential vitamins and minerals in one easy softgel. Formulated to support energy, immunity, and overall wellness — just one capsule with breakfast.',
    24.99,
    array['https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=800&q=80'],
    100
  ),
  (
    'omega-3-fish-oil',
    'Omega-3 Fish Oil',
    'Purified fish oil rich in EPA and DHA.',
    'Sourced from wild-caught fish and molecularly distilled for purity, each softgel delivers 1,000mg of omega-3s (EPA + DHA) to support heart, brain, and joint health.',
    27.99,
    array['https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&w=800&q=80'],
    100
  ),
  (
    'ashwagandha-extract',
    'Ashwagandha Extract',
    'Adaptogenic herb to help manage everyday stress.',
    'Our ashwagandha extract is standardized for withanolide content, the compound behind this ancient adaptogen''s calming, stress-supporting effects. Take daily to help your body adapt to everyday stress.',
    21.75,
    array['https://images.unsplash.com/photo-1622480916113-9000ac49b79d?auto=format&fit=crop&w=800&q=80'],
    100
  ),
  (
    'magnesium-glycinate',
    'Magnesium Glycinate',
    'A gentle, highly absorbable form of magnesium.',
    'Magnesium glycinate is easier on the stomach than other forms of magnesium, supporting muscle relaxation, better sleep, and healthy nerve function without the laxative effect.',
    19.99,
    array['https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=800&q=80'],
    100
  )
on conflict (slug) do nothing;
