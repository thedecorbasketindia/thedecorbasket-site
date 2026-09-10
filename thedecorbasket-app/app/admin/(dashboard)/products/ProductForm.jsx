"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ImageUploader from "@/components/admin/ImageUploader";
import { saveProduct, deleteProduct } from "./actions";

const emptyVariant = { name: "", hex_color: "", image_url: "", price: "", sku: "", stock: "", available: true };

export default function ProductForm({ product, categories }) {
  const router = useRouter();
  const [form, setForm] = useState({
    id: product?.id,
    name: product?.name || "",
    slug: product?.slug || "",
    short_description: product?.short_description || "",
    full_description: product?.full_description || "",
    price: product?.price ?? "",
    compare_at_price: product?.compare_at_price ?? "",
    sku: product?.sku || "",
    category_id: product?.category_id || "",
    tags: product?.tags?.join(", ") || "",
    stock_status: product?.stock_status || "in_stock",
    quantity: product?.quantity ?? "",
    featured: product?.featured || false,
    best_seller: product?.best_seller || false,
    new_arrival: product?.new_arrival || false,
    on_sale: product?.on_sale || false,
    published: product?.published || false,
    display_order: product?.display_order ?? 0,
    meta_title: product?.meta_title || "",
    meta_description: product?.meta_description || "",
  });
  const [images, setImages] = useState(
    product?.images?.map((i) => ({ url: i.url, alt_text: i.alt_text, is_primary: i.is_primary })) || []
  );
  const [variants, setVariants] = useState(product?.variants || []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function addVariant() {
    setVariants((v) => [...v, { ...emptyVariant }]);
  }
  function updateVariant(i, key, value) {
    setVariants((v) => v.map((row, idx) => (idx === i ? { ...row, [key]: value } : row)));
  }
  function removeVariant(i) {
    setVariants((v) => v.filter((_, idx) => idx !== i));
  }

  function removeImage(i) {
    setImages((imgs) => imgs.filter((_, idx) => idx !== i));
  }
  function makePrimary(i) {
    setImages((imgs) => imgs.map((img, idx) => ({ ...img, is_primary: idx === i })));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const result = await saveProduct({ ...form, images, variants });
    setSaving(false);
    if (result?.error) {
      setError(result.error);
      return;
    }
    router.push("/admin/products");
    router.refresh();
  }

  async function handleDelete() {
    if (!product?.id) return;
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    await deleteProduct(product.id);
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
      {error && <p className="bg-red-50 text-red-700 text-sm rounded p-3">{error}</p>}

      <section className="bg-white rounded-md p-5 shadow-sm space-y-4">
        <h2 className="font-medium">Basics</h2>
        <div>
          <label className="block text-sm mb-1">Product name *</label>
          <input required value={form.name} onChange={(e) => set("name", e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm mb-1">URL slug (leave blank to auto-generate)</label>
          <input value={form.slug} onChange={(e) => set("slug", e.target.value)}
            placeholder="auto-generated-from-name"
            className="w-full border rounded px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm mb-1">Short description</label>
          <input value={form.short_description} onChange={(e) => set("short_description", e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm mb-1">Full description</label>
          <textarea value={form.full_description} onChange={(e) => set("full_description", e.target.value)}
            rows={4} className="w-full border rounded px-3 py-2 text-sm" />
        </div>
      </section>

      <section className="bg-white rounded-md p-5 shadow-sm space-y-4">
        <h2 className="font-medium">Pricing & Inventory</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Price (₹) *</label>
            <input required type="number" step="0.01" value={form.price}
              onChange={(e) => set("price", e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm mb-1">Compare-at price (₹)</label>
            <input type="number" step="0.01" value={form.compare_at_price}
              onChange={(e) => set("compare_at_price", e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm mb-1">SKU</label>
            <input value={form.sku} onChange={(e) => set("sku", e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm mb-1">Stock status</label>
            <select value={form.stock_status} onChange={(e) => set("stock_status", e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm">
              <option value="in_stock">In stock</option>
              <option value="out_of_stock">Out of stock</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Quantity (optional)</label>
            <input type="number" value={form.quantity} onChange={(e) => set("quantity", e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm" />
          </div>
        </div>
      </section>

      <section className="bg-white rounded-md p-5 shadow-sm space-y-4">
        <h2 className="font-medium">Category & Tags</h2>
        <div>
          <label className="block text-sm mb-1">Category</label>
          <select value={form.category_id} onChange={(e) => set("category_id", e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm">
            <option value="">— None —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Tags (comma-separated)</label>
          <input value={form.tags} onChange={(e) => set("tags", e.target.value)}
            placeholder="festive, gifting, diwali"
            className="w-full border rounded px-3 py-2 text-sm" />
        </div>
      </section>

      <section className="bg-white rounded-md p-5 shadow-sm space-y-4">
        <h2 className="font-medium">Images</h2>
        <ImageUploader
          folder="products"
          label="Add a product photo"
          onUploaded={(url) => setImages((imgs) => [...imgs, { url, alt_text: form.name, is_primary: imgs.length === 0 }])}
        />
        {images.length > 0 && (
          <div className="grid grid-cols-4 gap-3">
            {images.map((img, i) => (
              <div key={img.url} className="relative border rounded overflow-hidden">
                <div className="w-full aspect-square relative">
                  <Image src={img.url} alt="" fill className="object-cover" />
                </div>
                <div className="flex justify-between text-[11px] p-1 bg-gray-50">
                  <button type="button" onClick={() => makePrimary(i)} className={img.is_primary ? "font-semibold" : ""}>
                    {img.is_primary ? "Primary" : "Set primary"}
                  </button>
                  <button type="button" onClick={() => removeImage(i)} className="text-red-600">Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="bg-white rounded-md p-5 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-medium">Variants (optional)</h2>
          <button type="button" onClick={addVariant} className="text-sm border rounded px-3 py-1">+ Add variant</button>
        </div>
        {variants.map((v, i) => (
          <div key={i} className="grid grid-cols-6 gap-2 items-center border-b pb-3">
            <input placeholder="Name" value={v.name} onChange={(e) => updateVariant(i, "name", e.target.value)}
              className="border rounded px-2 py-1.5 text-sm col-span-2" />
            <input placeholder="#hex" value={v.hex_color || ""} onChange={(e) => updateVariant(i, "hex_color", e.target.value)}
              className="border rounded px-2 py-1.5 text-sm" />
            <input placeholder="Price override" type="number" value={v.price || ""} onChange={(e) => updateVariant(i, "price", e.target.value)}
              className="border rounded px-2 py-1.5 text-sm" />
            <input placeholder="Stock" type="number" value={v.stock || ""} onChange={(e) => updateVariant(i, "stock", e.target.value)}
              className="border rounded px-2 py-1.5 text-sm" />
            <button type="button" onClick={() => removeVariant(i)} className="text-red-600 text-sm">Remove</button>
          </div>
        ))}
      </section>

      <section className="bg-white rounded-md p-5 shadow-sm space-y-3">
        <h2 className="font-medium mb-2">Status</h2>
        {[
          ["published", "Published (visible on storefront)"],
          ["featured", "Featured"],
          ["best_seller", "Best Seller"],
          ["new_arrival", "New Arrival"],
          ["on_sale", "On Sale"],
        ].map(([key, label]) => (
          <label key={key} className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form[key]} onChange={(e) => set(key, e.target.checked)} />
            {label}
          </label>
        ))}
      </section>

      <section className="bg-white rounded-md p-5 shadow-sm space-y-4">
        <h2 className="font-medium">SEO (optional)</h2>
        <div>
          <label className="block text-sm mb-1">Meta title</label>
          <input value={form.meta_title} onChange={(e) => set("meta_title", e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm mb-1">Meta description</label>
          <textarea value={form.meta_description} onChange={(e) => set("meta_description", e.target.value)}
            rows={2} className="w-full border rounded px-3 py-2 text-sm" />
        </div>
      </section>

      <div className="flex gap-3">
        <button disabled={saving} type="submit" className="bg-[#7C0E2A] text-white rounded px-5 py-2.5 text-sm">
          {saving ? "Saving…" : "Save Product"}
        </button>
        {product?.id && (
          <button type="button" onClick={handleDelete} className="border border-red-600 text-red-600 rounded px-5 py-2.5 text-sm">
            Delete Product
          </button>
        )}
      </div>
    </form>
  );
}
