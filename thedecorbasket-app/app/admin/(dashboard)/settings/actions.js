"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateSiteSettings(payload) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("homepage_settings")
    .update({
      site_title: payload.site_title,
      logo_url: payload.logo_url,
      tagline: payload.tagline,
      primary_color: payload.primary_color,
      accent_color: payload.accent_color,
      whatsapp_number: payload.whatsapp_number,
      email: payload.email,
      instagram_url: payload.instagram_url,
    })
    .eq("id", 1);

  revalidatePath("/");
  revalidatePath("/admin/settings");
  if (error) return { error: error.message };
  return { success: true };
}
