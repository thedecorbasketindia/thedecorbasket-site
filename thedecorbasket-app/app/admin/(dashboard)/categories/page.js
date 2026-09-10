import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";

export default async function CategoriesListPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("display_order");

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Categories</h1>
        <Link href="/admin/categories/new" className="bg-[#7C0E2A] text-white text-sm rounded px-4 py-2">
          + Add Category
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories?.map((c) => (
          <Link key={c.id} href={`/admin/categories/${c.id}`} className="bg-white rounded-md shadow-sm overflow-hidden">
            <div className="h-24 relative bg-gray-100">
              {c.image_url && <Image src={c.image_url} alt="" fill className="object-cover" />}
            </div>
            <div className="p-3">
              <p className="font-medium text-sm">{c.name}</p>
              <p className="text-xs text-gray-400">{c.enabled ? "Enabled" : "Hidden"} · order {c.display_order}</p>
            </div>
          </Link>
        ))}
      </div>
      {!categories?.length && <p className="text-gray-500 text-sm">No categories yet.</p>}
    </div>
  );
}
