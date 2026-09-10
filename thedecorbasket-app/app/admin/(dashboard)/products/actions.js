"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/utils";

/**
 * Creates or updates a product, replacing its images and variants.
 * payload: {
 *   id, name, slug, short_description, full_description, price, compare_at_price,
 *   sku, category_id, tags (string, comma-separated), stock_status, quantity,
 *   featured, best_seller, new_arrival, on_sale, published, display_order,
 *   meta_title, meta_description,
 *   images: [{ url, alt_text, is_primary, display_order }],
 *   variants: [{ name, hex_color, image_url, price, sku, stock, available, display_order }]
 * }
 */
export async function saveProduct(payload) {
  const supabase = await createClient();

  const {
    id,
    images = [],
    variants = [],
    tags,
    ...fields
  } = payload;

  const productRow = {
    ...fields,
    slug: fields.slug?.trim() ? slugify(fields.slug) : slugify(fields.name),
    tags: tags
      ? tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [],
    price: Number(fields.price) || 0,
    compare_at_price: fields.compare_at_price ? Number(fields.compare_at_price) : null,
    quantity: fields.quantity ? Number(fields.quantity) : null,
    updated_at: new Date().toISOString(),
  };

  let productId = id;

  if (id) {
    const { error } = await supabase.from("products").update(productRow).eq("id", id);
    if (error) return { error: error.message };
  } else {
    const { data, error } = await supabase.from("products").insert(productRow).select("id").single();
    if (error) return { error: error.message };
    productId = data.id;
  }

  // Replace images
  await supabase.from("product_images").delete().eq("product_id", productId);
  if (images.length) {
    const imageRows = images.map((img, i) => ({
      product_id: productId,
      url: img.url,
      alt_text: img.alt_text || "",
      display_order: i,
      is_primary: img.is_primary || i === 0,
    }));
    const { error } = await supabase.from("product_images").insert(imageRows);
    if (error) return { error: error.message };
  }

  // Replace variants
  await supabase.from("product_variants").delete().eq("product_id", productId);
  if (variants.length) {
    const variantRows = variants.map((v, i) => ({
      product_id: productId,
      name: v.name,
      hex_color: v.hex_color || null,
      image_url: v.image_url || null,
      price: v.price ? Number(v.price) : null,
      sku: v.sku || null,
      stock: v.stock ? Number(v.stock) : null,
      available: v.available !== false,
      display_order: i,
    }));
    const { error } = await supabase.from("product_variants").insert(variantRows);
    if (error) return { error: error.message };
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");
  return { id: productId };
}

export async function deleteProduct(id) {
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");
  if (error) return { error: error.message };
  return { success: true };
}

export async function toggleProductField(id, field, value) {
  const supabase = await createClient();
  const { error } = await supabase.from("products").update({ [field]: value }).eq("id", id);
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");
  if (error) return { error: error.message };
  return { success: true };
}
