"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateHeroSettings(payload) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("homepage_settings")
    .update({
      hero_headline: payload.hero_headline,
      hero_subheadline: payload.hero_subheadline,
      hero_cta_text: payload.hero_cta_text,
      hero_cta_url: payload.hero_cta_url,
      hero_image: payload.hero_image,
      hero_image_mobile: payload.hero_image_mobile,
      hero_overlay: Number(payload.hero_overlay) || 0,
      hero_align: payload.hero_align,
      hero_active: payload.hero_active,
      announcement_text: payload.announcement_text,
      announcement_active: payload.announcement_active,
    })
    .eq("id", 1);

  revalidatePath("/");
  revalidatePath("/admin/homepage");
  if (error) return { error: error.message };
  return { success: true };
}

export async function saveSlide(payload) {
  const supabase = await createClient();
  const { id, ...fields } = payload;
  const row = {
    image_url: fields.image_url,
    mobile_image_url: fields.mobile_image_url || null,
    headline: fields.headline || null,
    subtitle: fields.subtitle || null,
    cta_text: fields.cta_text || null,
    cta_url: fields.cta_url || null,
    overlay_strength: Number(fields.overlay_strength) || 0.25,
    display_order: Number(fields.display_order) || 0,
    active: fields.active !== false,
  };

  let result;
  if (id) {
    result = await supabase.from("hero_slides").update(row).eq("id", id);
  } else {
    result = await supabase.from("hero_slides").insert(row);
  }

  revalidatePath("/");
  revalidatePath("/admin/homepage");
  if (result.error) return { error: result.error.message };
  return { success: true };
}

export async function deleteSlide(id) {
  const supabase = await createClient();
  const { error } = await supabase.from("hero_slides").delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/homepage");
  if (error) return { error: error.message };
  return { success: true };
}
