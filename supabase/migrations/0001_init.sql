-- Hot Vitality — initial schema
-- Run this once in the Supabase SQL Editor (Project → SQL Editor → New query → paste → Run).

-- ── profiles ──────────────────────────────────────────────────────────────
-- Supabase Auth already has a built-in `auth.users` table (handles
-- email/password, sessions, etc). We can't add custom columns to it
-- directly, so we keep a `profiles` row per user with the extra fields
-- our app needs (name, role).
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

-- Whenever someone signs up through Supabase Auth, automatically create
-- their matching profiles row (starts out as a regular customer).
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Small helper so RLS policies can check "is this user an admin?" without
-- re-triggering RLS on `profiles` itself (which would cause infinite
-- recursion if we queried `profiles` straight from a `profiles` policy).
create function public.is_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ── products ──────────────────────────────────────────────────────────────
create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  short_description text,
  description text,
  price numeric(10, 2) not null check (price >= 0),
  images text[] not null default '{}',
  stock integer not null default 0 check (stock >= 0),
  category text check (
    category in ('vitamins', 'protein', 'minerals', 'herbal', 'wellness')
  ),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── orders ────────────────────────────────────────────────────────────────
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  -- Nullable: guest checkout is allowed. `customer_email` is always
  -- required (even for guests) so every order can still be tracked.
  user_id uuid references auth.users (id) on delete set null,
  customer_name text not null,
  customer_email text not null,
  status text not null default 'pending' check (
    status in ('pending', 'paid', 'shipped', 'refunded')
  ),
  shipping_address jsonb,
  subtotal numeric(10, 2) not null check (subtotal >= 0),
  total numeric(10, 2) not null check (total >= 0),
  created_at timestamptz not null default now()
);

-- ── order_items ───────────────────────────────────────────────────────────
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  -- Kept nullable + `on delete set null` so a product can be removed later
  -- without deleting historical order records.
  product_id uuid references public.products (id) on delete set null,
  -- Snapshots of the name/price at purchase time, so this order still
  -- shows what the customer actually paid even if the product changes later.
  product_name text not null,
  unit_price numeric(10, 2) not null check (unit_price >= 0),
  quantity integer not null check (quantity > 0)
);

create index order_items_order_id_idx on public.order_items (order_id);
create index orders_user_id_idx on public.orders (user_id);
create index products_category_idx on public.products (category);

-- ── Row Level Security ──────────────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- profiles: everyone can see their own profile; admins can see/manage all.
create policy "profiles_select_own_or_admin" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "profiles_admin_all" on public.profiles
  for all using (public.is_admin()) with check (public.is_admin());

-- products: catalog is public (anyone can browse, logged in or not).
-- Only admins can create/edit/delete products.
create policy "products_select_all" on public.products
  for select using (true);

create policy "products_admin_write" on public.products
  for insert with check (public.is_admin());

create policy "products_admin_update" on public.products
  for update using (public.is_admin()) with check (public.is_admin());

create policy "products_admin_delete" on public.products
  for delete using (public.is_admin());

-- orders: a logged-in user can see/create their own orders; guests can
-- create an order (user_id left null) but can't read it back later since
-- they have no account — that's expected, they get a confirmation page
-- instead. Admins can see and manage every order.
create policy "orders_select_own_or_admin" on public.orders
  for select using (auth.uid() = user_id or public.is_admin());

create policy "orders_insert_own_or_guest" on public.orders
  for insert with check (
    auth.uid() = user_id or user_id is null
  );

create policy "orders_admin_update" on public.orders
  for update using (public.is_admin()) with check (public.is_admin());

-- order_items: readable/insertable alongside their parent order.
create policy "order_items_select_via_order" on public.order_items
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and (o.user_id = auth.uid() or public.is_admin())
    )
  );

create policy "order_items_insert_via_order" on public.order_items
  for insert with check (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and (o.user_id = auth.uid() or o.user_id is null)
    )
  );

create policy "order_items_admin_update" on public.order_items
  for update using (public.is_admin()) with check (public.is_admin());
