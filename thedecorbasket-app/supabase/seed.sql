-- =========================================================
-- The Decor Basket — starter seed data
-- Run AFTER schema.sql. Safe to skip/edit before running —
-- everything here can also be added/edited later from /admin.
-- Prices marked "-- PLACEHOLDER" were never confirmed by you;
-- update them for real in the admin before publishing.
-- =========================================================

insert into categories (name, slug, description, display_order, enabled) values
  ('Home Decor', 'home-decor', 'Reed diffusers, trays and decorative pieces for every room.', 1, true),
  ('Wooden Craft', 'wooden-craft', 'Hand-finished wooden trays and enamel-detailed pieces.', 2, true),
  ('Fashion', 'fashion', 'Style essentials curated by The Decor Basket.', 3, true),
  ('Candles', 'candles', 'Festive and everyday scented candles, hand finished.', 4, true),
  ('Others', 'others', 'Handmade crochet keychains, bag charms and more.', 5, true)
on conflict (slug) do nothing;

-- Products (image_url left blank — add real photos via /admin → Products → Images)
insert into products (name, slug, short_description, price, category_id, published, featured, stock_status)
select
  'Rose Reed Diffuser Gift Set',
  'rose-reed-diffuser-gift-set',
  'Rose-scented reed diffuser oil with reeds, in a festive gift box.',
  599, -- PLACEHOLDER
  (select id from categories where slug = 'home-decor'),
  true, true, 'in_stock'
where not exists (select 1 from products where slug = 'rose-reed-diffuser-gift-set');

insert into products (name, slug, short_description, price, category_id, published, featured, stock_status)
select
  'Copper Bottle Celebration Gift Set',
  'copper-bottle-celebration-gift-set',
  'Hand-painted copper bottle with two matching glasses in a keepsake box.',
  899, -- PLACEHOLDER
  (select id from categories where slug = 'others'),
  true, true, 'in_stock'
where not exists (select 1 from products where slug = 'copper-bottle-celebration-gift-set');

insert into products (name, slug, short_description, price, category_id, published, stock_status)
select
  'Laddu Shaped Festive Candle',
  'laddu-shaped-festive-candle',
  'Hand-finished decorative candle styled like a traditional laddu, with silver leaf detail.',
  249, -- PLACEHOLDER
  (select id from categories where slug = 'candles'),
  true, 'in_stock'
where not exists (select 1 from products where slug = 'laddu-shaped-festive-candle');

insert into products (name, slug, short_description, price, category_id, published, stock_status)
select
  'Barfi Shaped Festive Candle',
  'barfi-shaped-festive-candle',
  'Delicate barfi-styled candle finished with pistachio and rose petal accents.',
  249, -- PLACEHOLDER
  (select id from categories where slug = 'candles'),
  true, 'in_stock'
where not exists (select 1 from products where slug = 'barfi-shaped-festive-candle');

insert into products (name, slug, short_description, price, category_id, published, stock_status)
select
  'Crystal Cut Jar Candle (Set of 2)',
  'crystal-cut-jar-candle-set',
  'Ornate crystal-cut glass jar candles with fitted lids — a set of two.',
  699, -- PLACEHOLDER
  (select id from categories where slug = 'candles'),
  true, 'in_stock'
where not exists (select 1 from products where slug = 'crystal-cut-jar-candle-set');

insert into products (name, slug, short_description, price, category_id, published, stock_status)
select
  'Mini Scented Jar Candles — Set of 6',
  'mini-scented-jar-candles-set-of-6',
  'Six mini scented candles: Lavender Vanilla, Royal Oudh, Lotus & Rose, Cedar Clove, Honey Vanilla, Apple Cinnamon.',
  549, -- PLACEHOLDER
  (select id from categories where slug = 'candles'),
  true, 'in_stock'
where not exists (select 1 from products where slug = 'mini-scented-jar-candles-set-of-6');

insert into products (name, slug, short_description, price, category_id, published, stock_status)
select
  'Round Wooden Tray — Enamel Floral',
  'round-wooden-tray-enamel-floral',
  'Hand-enamelled wooden tray with a traditional floral motif and brass rim finish.',
  649, -- PLACEHOLDER
  (select id from categories where slug = 'wooden-craft'),
  true, 'in_stock'
where not exists (select 1 from products where slug = 'round-wooden-tray-enamel-floral');

insert into collections (name, slug, description, display_order) values
  ('Featured', 'featured', 'Hand-picked highlights from across the store.', 1),
  ('New Arrivals', 'new-arrivals', 'Just added to The Decor Basket.', 2),
  ('Best Sellers', 'best-sellers', 'Customer favourites.', 3),
  ('Festive', 'festive', 'Diwali and festive-season picks.', 4)
on conflict (slug) do nothing;
