-- A public bucket for product photos. "Public" means anyone can view a
-- file by its URL (needed so customers' browsers can load product images
-- with no auth) — uploads/deletes still only happen through our admin
-- Server Actions, which use the service role key.
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;
