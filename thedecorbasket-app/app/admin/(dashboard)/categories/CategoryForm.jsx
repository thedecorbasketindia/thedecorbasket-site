"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ImageUploader from "@/components/admin/ImageUploader";
import { saveCategory, deleteCategory } from "./actions";

export default function CategoryForm({ category }) {
  const router = useRouter();
  const [form, setForm] = useState({
    id: category?.id,
    name: category?.name || "",
    slug: category?.slug || "",
    description: category?.description || "",
    image_url: category?.image_url || "",
    display_order: category?.display_order ?? 0,
    enabled: category?.enabled ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const result = await saveCategory(form);
    setSaving(false);
    if (result?.error) return setError(result.error);
    router.push("/admin/categories");
    router.refresh();
  }

  async function handleDelete() {
    if (!category?.id) return;
    if (!confirm(`Delete category "${category.name}"? Products keep their data but lose this category.`)) return;
    await deleteCategory(category.id);
    router.push("/admin/categories");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
      {error && <p className="bg-red-50 text-red-700 text-sm rounded p-3">{error}</p>}

      <section className="bg-white rounded-md p-5 shadow-sm space-y-4">
        <div>
          <label className="block text-sm mb-1">Category name *</label>
          <input required value={form.name} onChange={(e) => set("name", e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm mb-1">URL slug (leave blank to auto-generate)</label>
          <input value={form.slug} onChange={(e) => set("slug", e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm mb-1">Description</label>
          <textarea value={form.description} onChange={(e) => set("description", e.target.value)}
            rows={3} className="w-full border rounded px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm mb-1">Display order</label>
          <input type="number" value={form.display_order} onChange={(e) => set("display_order", e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm" />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.enabled} onChange={(e) => set("enabled", e.target.checked)} />
          Enabled (visible on storefront)
        </label>
      </section>

      <section className="bg-white rounded-md p-5 shadow-sm space-y-3">
        <h2 className="font-medium">Category image</h2>
        {form.image_url && (
          <div className="w-32 h-32 relative rounded overflow-hidden">
            <Image src={form.image_url} alt="" fill className="object-cover" />
          </div>
        )}
        <ImageUploader folder="categories" label="Upload category image" onUploaded={(url) => set("image_url", url)} />
      </section>

      <div className="flex gap-3">
        <button disabled={saving} type="submit" className="bg-[#7C0E2A] text-white rounded px-5 py-2.5 text-sm">
          {saving ? "Saving…" : "Save Category"}
        </button>
        {category?.id && (
          <button type="button" onClick={handleDelete} className="border border-red-600 text-red-600 rounded px-5 py-2.5 text-sm">
            Delete
          </button>
        )}
      </div>
    </form>
  );
}
