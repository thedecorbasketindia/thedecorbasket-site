import { createClient } from "@/lib/supabase/server";

// ---------- Homepage / site settings ----------
export async function getHomepageSettings() {
  const supabase = await createClient();
  const { data } = await supabase.from("homepage_settings").select("*").eq("id", 1).single();
  return data;
}

export async function getHeroSlides() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("hero_slides")
    .select("*")
    .eq("active", true)
    .order("display_order", { ascending: true });
  return data || [];
}

// ---------- Categories ----------
export async function getCategories() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("enabled", true)
    .order("display_order", { ascending: true });
  return data || [];
}

export async function getCategoryBySlug(slug) {
  const supabase = await createClient();
  const { data } = await supabase.from("categories").select("*").eq("slug", slug).single();
  return data;
}

// ---------- Products ----------
const PRODUCT_LIST_SELECT = `
  *,
  category:categories(id, name, slug),
  images:product_images(id, url, alt_text, display_order, is_primary)
`;

export async function getProducts(opts = {}) {
  const supabase = await createClient();
  let query = supabase.from("products").select(PRODUCT_LIST_SELECT).eq("published", true);

  if (opts.categorySlug) {
    const category = await getCategoryBySlug(opts.categorySlug);
    if (!category) return [];
    query = query.eq("category_id", category.id);
  }
  if (opts.featured) query = query.eq("featured", true);
  if (opts.bestSeller) query = query.eq("best_seller", true);
  if (opts.newArrival) query = query.eq("new_arrival", true);
  if (opts.onSale) query = query.eq("on_sale", true);
  if (opts.search) query = query.ilike("name", `%${opts.search}%`);
  if (opts.minPrice != null) query = query.gte("price", opts.minPrice);
  if (opts.maxPrice != null) query = query.lte("price", opts.maxPrice);

  switch (opts.sort) {
    case "price_asc":
      query = query.order("price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price", { ascending: false });
      break;
    case "newest":
      query = query.order("created_at", { ascending: false });
      break;
    default:
      query = query.order("display_order", { ascending: true });
  }

  if (opts.limit) query = query.limit(opts.limit);

  const { data, error } = await query;
  if (error) {
    console.error("getProducts error:", error.message);
    return [];
  }
  return (data || []).map(normalizeProduct);
}

export async function getProductBySlug(slug) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      `*,
      category:categories(id, name, slug),
      images:product_images(id, url, alt_text, display_order, is_primary),
      variants:product_variants(id, name, hex_color, image_url, price, sku, stock, available, display_order)`
    )
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error) return null;
  return normalizeProduct(data);
}

export async function getRelatedProducts(categoryId, excludeId, limit = 4) {
  if (!categoryId) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_LIST_SELECT)
    .eq("published", true)
    .eq("category_id", categoryId)
    .neq("id", excludeId)
    .limit(limit);
  return (data || []).map(normalizeProduct);
}

function normalizeProduct(p) {
  if (!p) return p;
  const images = (p.images || []).sort((a, b) => a.display_order - b.display_order);
  const primary = images.find((i) => i.is_primary) || images[0];
  return { ...p, images, primaryImage: primary?.url || null };
}

// ---------- Collections ----------
export async function getCollectionBySlug(slug) {
  const supabase = await createClient();
  const { data: collection } = await supabase
    .from("collections")
    .select("*")
    .eq("slug", slug)
    .eq("enabled", true)
    .single();
  if (!collection) return null;

  const { data: links } = await supabase
    .from("collection_products")
    .select("product_id, display_order")
    .eq("collection_id", collection.id)
    .order("display_order", { ascending: true });

  const ids = (links || []).map((l) => l.product_id);
  if (!ids.length) return { ...collection, products: [] };

  const supabase2 = await createClient();
  const { data: products } = await supabase2
    .from("products")
    .select(PRODUCT_LIST_SELECT)
    .in("id", ids)
    .eq("published", true);

  return { ...collection, products: (products || []).map(normalizeProduct) };
}
