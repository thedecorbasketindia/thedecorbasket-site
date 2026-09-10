import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";

export default async function ProductsListPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*, category:categories(name), images:product_images(url, is_primary)")
    .order("updated_at", { ascending: false });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Link href="/admin/products/new" className="bg-[#7C0E2A] text-white text-sm rounded px-4 py-2">
          + Add Product
        </Link>
      </div>

      <div className="bg-white rounded-md shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="p-3">Photo</th>
              <th className="p-3">Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Status</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products?.map((p) => {
              const img = p.images?.find((i) => i.is_primary) || p.images?.[0];
              return (
                <tr key={p.id}>
                  <td className="p-3">
                    <div className="w-10 h-10 relative rounded overflow-hidden bg-gray-100">
                      {img && <Image src={img.url} alt="" fill className="object-cover" />}
                    </div>
                  </td>
                  <td className="p-3">{p.name}</td>
                  <td className="p-3">{p.category?.name || "—"}</td>
                  <td className="p-3">{formatPrice(p.price)}</td>
                  <td className="p-3">
                    <span className={p.published ? "text-green-600" : "text-gray-400"}>
                      {p.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <Link href={`/admin/products/${p.id}`} className="text-[#7C0E2A] hover:underline">
                      Edit
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!products?.length && (
          <p className="p-6 text-center text-gray-500 text-sm">No products yet.</p>
        )}
      </div>
    </div>
  );
}
