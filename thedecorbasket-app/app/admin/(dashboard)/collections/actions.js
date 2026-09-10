"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/utils";

export async function createCollection(payload) {
  const supabase = await createClient();
  const { error } = await supabase.from("collections").insert({
    name: payload.name,
    slug: slugify(payload.name),
    description: payload.description || null,
  });
  revalidatePath("/admin/collections");
  if (error) return { error: error.message };
  return { success: true };
}

export async function updateCollection(id, payload) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("collections")
    .update({
      name: payload.name,
      description: payload.description || null,
      enabled: payload.enabled,
    })
    .eq("id", id);

  if (error) return { error: error.message };

  // Replace product assignments
  await supabase.from("collection_products").delete().eq("collection_id", id);
  if (payload.productIds?.length) {
    const rows = payload.productIds.map((productId, i) => ({
      collection_id: id,
      product_id: productId,
      display_order: i,
    }));
    const { error: linkError } = await supabase.from("collection_products").insert(rows);
    if (linkError) return { error: linkError.message };
  }

  revalidatePath("/admin/collections");
  revalidatePath("/");
  return { success: true };
}

export async function deleteCollection(id) {
  const supabase = await createClient();
  const { error } = await supabase.from("collections").delete().eq("id", id);
  revalidatePath("/admin/collections");
  if (error) return { error: error.message };
  return { success: true };
}
