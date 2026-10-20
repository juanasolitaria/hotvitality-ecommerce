-- Lets the admin drag-and-drop products into a custom order on
-- /admin/products, which then drives both the homepage's "Bestsellers"
-- section and the /shop catalog (both read getProducts(), which now
-- orders by this instead of created_at). See src/app/admin/products/actions.ts
-- for how new products get appended to the end and reorderProducts()
-- persists a drag.

alter table products
  add column display_order integer not null default 0;

-- Existing rows all start at the same default (0), which would make
-- their relative order arbitrary — seed them with the order they already
-- display in today (oldest first, same as the old `created_at` sort) so
-- nothing visibly reshuffles the moment this migration runs.
with ordered as (
  select id, row_number() over (order by created_at asc) - 1 as rn
  from products
)
update products
set display_order = ordered.rn
from ordered
where products.id = ordered.id;
