-- =========================================================
-- The Decor Basket — Supabase schema
-- Run this once in Supabase: SQL Editor → New query → paste → Run
-- =========================================================

create extension if not exists "uuid-ossp";

-- ---------- Categories ----------
create table if not exists categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  display_order int not null default 0,
  enabled boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------- Products ----------
create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  short_description text,
  full_description text,
  price numeric(10,2) not null default 0,
  compare_at_price numeric(10,2),
  sku text,
  category_id uuid references categories(id) on delete set null,
  tags text[] default '{}',
  stock_status text not null default 'in_stock', -- in_stock | out_of_stock
  quantity int,
  featured boolean not null default false,
  best_seller boolean not null default false,
  new_arrival boolean not null default false,
  on_sale boolean not null default false,
  published boolean not null default false,
  display_order int not null default 0,
  meta_title text,
  meta_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_products_category on products(category_id);
create index if not exists idx_products_published on products(published);

-- ---------- Product images (gallery) ----------
create table if not exists product_images (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references products(id) on delete cascade,
  url text not null,
  alt_text text,
  display_order int not null default 0,
  is_primary boolean not null default false
);

create index if not exists idx_product_images_product on product_images(product_id);

-- ---------- Product variants (colour/style) ----------
create table if not exists product_variants (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references products(id) on delete cascade,
  name text not null,          -- e.g. "Rose", "Lemongrass"
  hex_color text,              -- e.g. "#B5651D" (optional swatch)
  image_url text,              -- optional variant-specific image
  price numeric(10,2),         -- optional override; null = use product price
  sku text,
  stock int,
  available boolean not null default true,
  display_order int not null default 0
);

create index if not exists idx_variants_product on product_variants(product_id);

-- ---------- Collections (Featured / Best Sellers / Festive etc.) ----------
create table if not exists collections (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text,
  display_order int not null default 0,
  enabled boolean not null default true
);

create table if not exists collection_products (
  collection_id uuid not null references collections(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  display_order int not null default 0,
  primary key (collection_id, product_id)
);

-- ---------- Homepage / site settings (single row) ----------
create table if not exists homepage_settings (
  id int primary key default 1,
  site_title text default 'The Decor Basket',
  logo_url text,
  tagline text default 'Curated with Care, Styled with Love',
  primary_color text default '#7C0E2A',
  accent_color text default '#C98A2B',
  announcement_text text,
  announcement_active boolean not null default false,
  hero_headline text default 'Thoughtfully Curated. Beautifully Made.',
  hero_subheadline text default '',
  hero_cta_text text default 'Shop the Collection',
  hero_cta_url text default '/shop',
  hero_image text,
  hero_image_mobile text,
  hero_overlay numeric default 0.25,
  hero_align text default 'center', -- left | center | right
  hero_active boolean not null default true,
  whatsapp_number text,
  email text,
  instagram_url text,
  constraint single_row check (id = 1)
);

insert into homepage_settings (id) values (1) on conflict (id) do nothing;

-- ---------- Hero / promo carousel slides ----------
create table if not exists hero_slides (
  id uuid primary key default uuid_generate_v4(),
  image_url text not null,
  mobile_image_url text,
  headline text,
  subtitle text,
  cta_text text,
  cta_url text,
  overlay_strength numeric default 0.25,
  display_order int not null default 0,
  active boolean not null default true
);

-- =========================================================
-- Row Level Security
-- Public (anon) visitors: read-only, and only published/enabled rows.
-- Authenticated (you, logged into /admin): full read/write access.
-- =========================================================

alter table categories enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table product_variants enable row level security;
alter table collections enable row level security;
alter table collection_products enable row level security;
alter table homepage_settings enable row level security;
alter table hero_slides enable row level security;

-- Categories
create policy "public read enabled categories" on categories
  for select using (enabled = true or auth.role() = 'authenticated');
create policy "admin write categories" on categories
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Products
create policy "public read published products" on products
  for select using (published = true or auth.role() = 'authenticated');
create policy "admin write products" on products
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Product images
create policy "public read product images" on product_images
  for select using (true);
create policy "admin write product images" on product_images
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Variants
create policy "public read variants" on product_variants
  for select using (true);
create policy "admin write variants" on product_variants
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Collections
create policy "public read enabled collections" on collections
  for select using (enabled = true or auth.role() = 'authenticated');
create policy "admin write collections" on collections
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public read collection_products" on collection_products
  for select using (true);
create policy "admin write collection_products" on collection_products
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Homepage settings
create policy "public read homepage_settings" on homepage_settings
  for select using (true);
create policy "admin write homepage_settings" on homepage_settings
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Hero slides
create policy "public read active hero_slides" on hero_slides
  for select using (active = true or auth.role() = 'authenticated');
create policy "admin write hero_slides" on hero_slides
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- =========================================================
-- Storage bucket for all site/product images
-- =========================================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "public read media"
  on storage.objects for select
  using (bucket_id = 'media');

create policy "admin upload media"
  on storage.objects for insert
  with check (bucket_id = 'media' and auth.role() = 'authenticated');

create policy "admin update media"
  on storage.objects for update
  using (bucket_id = 'media' and auth.role() = 'authenticated');

create policy "admin delete media"
  on storage.objects for delete
  using (bucket_id = 'media' and auth.role() = 'authenticated');
