"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import ImageUploader from "@/components/admin/ImageUploader";
import { updateSiteSettings } from "./actions";

export default function SettingsPage() {
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.from("homepage_settings").select("*").eq("id", 1).single().then(({ data }) => setSettings(data));
  }, []);

  function set(key, value) {
    setSettings((s) => ({ ...s, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    const result = await updateSiteSettings(settings);
    setSaving(false);
    setMessage(result?.error ? `Error: ${result.error}` : "Saved!");
    setTimeout(() => setMessage(null), 2500);
  }

  if (!settings) return <p className="text-sm text-gray-500">Loading…</p>;

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
      <h1 className="text-2xl font-semibold mb-2">Settings</h1>

      <section className="bg-white rounded-md p-5 shadow-sm space-y-4">
        <h2 className="font-medium">Brand</h2>
        <div>
          <label className="block text-sm mb-1">Site title</label>
          <input value={settings.site_title || ""} onChange={(e) => set("site_title", e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm mb-1">Tagline</label>
          <input value={settings.tagline || ""} onChange={(e) => set("tagline", e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm mb-1">Logo</label>
          {settings.logo_url && (
            <div className="w-40 h-16 relative mb-2">
              <Image src={settings.logo_url} alt="" fill className="object-contain" />
            </div>
          )}
          <ImageUploader folder="branding" label="Upload logo (transparent PNG recommended)" onUploaded={(url) => set("logo_url", url)} />
        </div>
      </section>

      <section className="bg-white rounded-md p-5 shadow-sm space-y-4">
        <h2 className="font-medium">Brand Colors</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Primary color</label>
            <input type="color" value={settings.primary_color || "#7C0E2A"} onChange={(e) => set("primary_color", e.target.value)}
              className="w-full h-10 border rounded" />
          </div>
          <div>
            <label className="block text-sm mb-1">Accent color</label>
            <input type="color" value={settings.accent_color || "#C98A2B"} onChange={(e) => set("accent_color", e.target.value)}
              className="w-full h-10 border rounded" />
          </div>
        </div>
        <p className="text-xs text-gray-400">
          Note: these are stored for reference and future styling use; the current theme's
          core colors are set in the code's design tokens. Ask your developer (or come back
          to Claude) to wire these through if you want live color-picker theming.
        </p>
      </section>

      <section className="bg-white rounded-md p-5 shadow-sm space-y-4">
        <h2 className="font-medium">Contact</h2>
        <div>
          <label className="block text-sm mb-1">WhatsApp number (country code + digits, no +)</label>
          <input value={settings.whatsapp_number || ""} onChange={(e) => set("whatsapp_number", e.target.value)}
            placeholder="919256881893" className="w-full border rounded px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input value={settings.email || ""} onChange={(e) => set("email", e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm mb-1">Instagram URL</label>
          <input value={settings.instagram_url || ""} onChange={(e) => set("instagram_url", e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm" />
        </div>
      </section>

      <button disabled={saving} type="submit" className="bg-[#7C0E2A] text-white rounded px-5 py-2.5 text-sm">
        {saving ? "Saving…" : "Save Settings"}
      </button>
      {message && <span className="ml-3 text-sm text-green-700">{message}</span>}
    </form>
  );
}
