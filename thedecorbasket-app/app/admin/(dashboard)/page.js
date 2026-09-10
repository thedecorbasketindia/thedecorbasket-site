import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();

  const [{ count: totalProducts }, { count: publishedProducts }, { count: featuredProducts }, { count: totalCategories }] =
    await Promise.all([
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase.from("products").select("*", { count: "exact", head: true }).eq("published", true),
      supabase.from("products").select("*", { count: "exact", head: true }).eq("featured", true),
      supabase.from("categories").select("*", { count: "exact", head: true }),
    ]);

  const { data: recent } = await supabase
    .from("products")
    .select("id, name, updated_at, published")
    .order("updated_at", { ascending: false })
    .limit(5);

  const stats = [
    { label: "Total Products", value: totalProducts ?? 0 },
    { label: "Published", value: publishedProducts ?? 0 },
    { label: "Featured", value: featuredProducts ?? 0 },
    { label: "Categories", value: totalCategories ?? 0 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-md p-5 shadow-sm">
            <p className="text-3xl font-semibold">{s.value}</p>
            <p className="text-sm text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-md p-5 shadow-sm">
        <h2 className="font-medium mb-3">Recently updated products</h2>
        {recent?.length ? (
          <ul className="divide-y">
            {recent.map((p) => (
              <li key={p.id} className="py-2 flex justify-between text-sm">
                <Link href={`/admin/products/${p.id}`} className="hover:underline">{p.name}</Link>
                <span className={p.published ? "text-green-600" : "text-gray-400"}>
                  {p.published ? "Published" : "Draft"}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No products yet — add your first one.</p>
        )}
      </div>

      <div className="mt-6 flex gap-3">
        <Link href="/admin/products/new" className="bg-[#7C0E2A] text-white text-sm rounded px-4 py-2">
          + Add Product
        </Link>
        <Link href="/admin/categories/new" className="border border-[#7C0E2A] text-[#7C0E2A] text-sm rounded px-4 py-2">
          + Add Category
        </Link>
      </div>
    </div>
  );
}
