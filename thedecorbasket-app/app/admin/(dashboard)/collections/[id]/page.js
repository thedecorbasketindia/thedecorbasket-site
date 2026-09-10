"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { updateCollection, deleteCollection } from "../actions";

export default function EditCollectionPage() {
  const { id } = useParams();
  const router = useRouter();
  const [collection, setCollection] = useState(null);
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const [{ data: coll }, { data: allProducts }, { data: links }] = await Promise.all([
        supabase.from("collections").select("*").eq("id", id).single(),
        supabase.from("products").select("id, name").order("name"),
        supabase.from("collection_products").select("product_id").eq("collection_id", id),
      ]);
      setCollection(coll);
      setProducts(allProducts || []);
      setSelected(new Set((links || []).map((l) => l.product_id)));
    }
    load();
  }, [id]);

  function toggle(productId) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(productId) ? next.delete(productId) : next.add(productId);
      return next;
    });
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    await updateCollection(id, {
      name: collection.name,
      description: collection.description,
      enabled: collection.enabled,
      productIds: [...selected],
    });
    setSaving(false);
    router.push("/admin/collections");
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm(`Delete collection "${collection.name}"?`)) return;
    await deleteCollection(id);
    router.push("/admin/collections");
  }

  if (!collection) return <p className="text-sm text-gray-500">Loading…</p>;

  return (
    <form onSubmit={handleSave} className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">Edit Collection</h1>

      <section className="bg-white rounded-md p-5 shadow-sm space-y-4">
        <div>
          <label className="block text-sm mb-1">Name</label>
          <input
            value={collection.name}
            onChange={(e) => setCollection({ ...collection, name: e.target.value })}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Description</label>
          <textarea
            value={collection.description || ""}
            onChange={(e) => setCollection({ ...collection, description: e.target.value })}
            rows={2}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={collection.enabled}
            onChange={(e) => setCollection({ ...collection, enabled: e.target.checked })}
          />
          Enabled
        </label>
      </section>

      <section className="bg-white rounded-md p-5 shadow-sm">
        <h2 className="font-medium mb-3">Products in this collection</h2>
        <div className="max-h-80 overflow-y-auto space-y-1">
          {products.map((p) => (
            <label key={p.id} className="flex items-center gap-2 text-sm py-1">
              <input type="checkbox" checked={selected.has(p.id)} onChange={() => toggle(p.id)} />
              {p.name}
            </label>
          ))}
        </div>
      </section>

      <div className="flex gap-3">
        <button disabled={saving} type="submit" className="bg-[#7C0E2A] text-white rounded px-5 py-2.5 text-sm">
          {saving ? "Saving…" : "Save Collection"}
        </button>
        <button type="button" onClick={handleDelete} className="border border-red-600 text-red-600 rounded px-5 py-2.5 text-sm">
          Delete
        </button>
      </div>
    </form>
  );
}
