"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/utils";

export async function saveCategory(payload) {
  const supabase = await createClient();
  const { id, ...fields } = payload;

  const row = {
    ...fields,
    slug: fields.slug?.trim() ? slugify(fields.slug) : slugify(fields.name),
    display_order: Number(fields.display_order) || 0,
  };

  let result;
  if (id) {
    result = await supabase.from("categories").update(row).eq("id", id);
  } else {
    result = await supabase.from("categories").insert(row);
  }

  revalidatePath("/admin/categories");
  revalidatePath("/shop");
  revalidatePath("/");
  if (result.error) return { error: result.error.message };
  return { success: true };
}

export async function deleteCategory(id) {
  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  revalidatePath("/admin/categories");
  revalidatePath("/shop");
  revalidatePath("/");
  if (error) return { error: error.message };
  return { success: true };
}
