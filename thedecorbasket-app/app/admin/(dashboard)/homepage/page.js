"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import ImageUploader from "@/components/admin/ImageUploader";
import { updateHeroSettings, saveSlide, deleteSlide } from "./actions";

const emptySlide = {
  image_url: "", mobile_image_url: "", headline: "", subtitle: "",
  cta_text: "", cta_url: "", overlay_strength: 0.25, display_order: 0, active: true,
};

export default function HomepageAdminPage() {
  const [settings, setSettings] = useState(null);
  const [slides, setSlides] = useState([]);
  const [newSlide, setNewSlide] = useState(emptySlide);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  async function refresh() {
    const supabase = createClient();
    const [{ data: s }, { data: sl }] = await Promise.all([
      supabase.from("homepage_settings").select("*").eq("id", 1).single(),
      supabase.from("hero_slides").select("*").order("display_order"),
    ]);
    setSettings(s);
    setSlides(sl || []);
  }

  useEffect(() => {
    refresh();
  }, []);

  function set(key, value) {
    setSettings((s) => ({ ...s, [key]: value }));
  }

  async function handleSaveHero(e) {
    e.preventDefault();
    setSaving(true);
    const result = await updateHeroSettings(settings);
    setSaving(false);
    setMessage(result?.error ? `Error: ${result.error}` : "Saved!");
    setTimeout(() => setMessage(null), 2500);
  }

  async function handleAddSlide(e) {
    e.preventDefault();
    if (!newSlide.image_url) return alert("Upload an image for the slide first.");
    await saveSlide({ ...newSlide, display_order: slides.length });
    setNewSlide(emptySlide);
    refresh();
  }

  async function handleDeleteSlide(id) {
    if (!confirm("Delete this slide?")) return;
    await deleteSlide(id);
    refresh();
  }

  if (!settings) return <p className="text-sm text-gray-500">Loading…</p>;

  return (
    <div className="max-w-3xl space-y-8">
      <h1 className="text-2xl font-semibold">Homepage</h1>

      <form onSubmit={handleSaveHero} className="space-y-6">
        <section className="bg-white rounded-md p-5 shadow-sm space-y-4">
          <h2 className="font-medium">Announcement Bar</h2>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={settings.announcement_active}
              onChange={(e) => set("announcement_active", e.target.checked)} />
            Show announcement bar
          </label>
          <input value={settings.announcement_text || ""} onChange={(e) => set("announcement_text", e.target.value)}
            placeholder="e.g. Free shipping across India this week"
            className="w-full border rounded px-3 py-2 text-sm" />
        </section>

        <section className="bg-white rounded-md p-5 shadow-sm space-y-4">
          <h2 className="font-medium">Fallback Hero (used only if no carousel slides below are active)</h2>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={settings.hero_active} onChange={(e) => set("hero_active", e.target.checked)} />
            Active
          </label>
          <div>
            <label className="block text-sm mb-1">Headline</label>
            <input value={settings.hero_headline || ""} onChange={(e) => set("hero_headline", e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm mb-1">Subheadline</label>
            <input value={settings.hero_subheadline || ""} onChange={(e) => set("hero_subheadline", e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">CTA text</label>
              <input value={settings.hero_cta_text || ""} onChange={(e) => set("hero_cta_text", e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm mb-1">CTA link</label>
              <input value={settings.hero_cta_url || ""} onChange={(e) => set("hero_cta_url", e.target.value)}
                placeholder="/shop" className="w-full border rounded px-3 py-2 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1">Overlay darkness (0 to 1)</label>
            <input type="number" step="0.05" min="0" max="1" value={settings.hero_overlay ?? 0.25}
              onChange={(e) => set("hero_overlay", e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm" />
          </div>
          {settings.hero_image && (
            <div className="w-40 h-24 relative rounded overflow-hidden">
              <Image src={settings.hero_image} alt="" fill className="object-cover" />
            </div>
          )}
          <ImageUploader folder="hero" label="Upload desktop hero image" onUploaded={(url) => set("hero_image", url)} />
          <ImageUploader folder="hero" label="Upload mobile hero image (optional)" onUploaded={(url) => set("hero_image_mobile", url)} />
        </section>

        <button disabled={saving} type="submit" className="bg-[#7C0E2A] text-white rounded px-5 py-2.5 text-sm">
          {saving ? "Saving…" : "Save Hero Settings"}
        </button>
        {message && <span className="ml-3 text-sm text-green-700">{message}</span>}
      </form>

      <section className="bg-white rounded-md p-5 shadow-sm space-y-4">
        <h2 className="font-medium">Promo Carousel Slides (takes priority over the fallback hero above when active)</h2>

        {slides.map((s) => (
          <div key={s.id} className="flex items-center gap-3 border-b pb-3">
            <div className="w-20 h-14 relative rounded overflow-hidden bg-gray-100 flex-shrink-0">
              {s.image_url && <Image src={s.image_url} alt="" fill className="object-cover" />}
            </div>
            <div className="flex-1 text-sm">
              <p className="font-medium">{s.headline || "(no headline)"}</p>
              <p className="text-gray-400">{s.active ? "Active" : "Inactive"} · order {s.display_order}</p>
            </div>
            <button onClick={() => handleDeleteSlide(s.id)} className="text-red-600 text-sm">Delete</button>
          </div>
        ))}

        <div className="pt-3 border-t space-y-3">
          <p className="text-sm font-medium">Add a new slide</p>
          <ImageUploader folder="hero-slides" label="Upload slide image" onUploaded={(url) => setNewSlide((s) => ({ ...s, image_url: url }))} />
          <input placeholder="Headline" value={newSlide.headline} onChange={(e) => setNewSlide((s) => ({ ...s, headline: e.target.value }))}
            className="w-full border rounded px-3 py-2 text-sm" />
          <input placeholder="Subtitle" value={newSlide.subtitle} onChange={(e) => setNewSlide((s) => ({ ...s, subtitle: e.target.value }))}
            className="w-full border rounded px-3 py-2 text-sm" />
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="CTA text" value={newSlide.cta_text} onChange={(e) => setNewSlide((s) => ({ ...s, cta_text: e.target.value }))}
              className="border rounded px-3 py-2 text-sm" />
            <input placeholder="CTA link, e.g. /shop" value={newSlide.cta_url} onChange={(e) => setNewSlide((s) => ({ ...s, cta_url: e.target.value }))}
              className="border rounded px-3 py-2 text-sm" />
          </div>
          <button onClick={handleAddSlide} className="border border-[#7C0E2A] text-[#7C0E2A] rounded px-4 py-2 text-sm">
            + Add Slide
          </button>
        </div>
      </section>
    </div>
  );
}
