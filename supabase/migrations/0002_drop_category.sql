-- Drop the `category` column from products — the store no longer
-- categorizes products.
drop index if exists public.products_category_idx;
alter table public.products drop column if exists category;
