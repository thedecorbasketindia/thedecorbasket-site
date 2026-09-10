import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getCategories, getProducts } from "@/lib/data";

export const metadata = { title: "Shop — The Decor Basket" };

export default async function ShopPage({ searchParams }) {
  const params = await searchParams;
  const categorySlug = params?.category || null;
  const sort = params?.sort || "default";
  const search = params?.q || "";

  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({ categorySlug, sort, search }),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-5 py-10">
      <h1 className="text-3xl mb-6">The Full Collection</h1>

      <form className="flex flex-wrap gap-3 mb-6" action="/shop">
        {categorySlug && <input type="hidden" name="category" value={categorySlug} />}
        <input
          type="text"
          name="q"
          defaultValue={search}
          placeholder="Search products…"
          className="border border-maroon/25 rounded-sm px-3 py-2 text-sm flex-1 min-w-[180px]"
        />
        <select
          name="sort"
          defaultValue={sort}
          className="border border-maroon/25 rounded-sm px-3 py-2 text-sm"
        >
          <option value="default">Sort: Featured</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="newest">Newest First</option>
        </select>
        <button className="btn btn-outline" type="submit">Apply</button>
      </form>

      <div className="flex flex-wrap gap-2 mb-8">
        <Link
          href="/shop"
          className={`px-4 py-2 rounded-full text-sm border ${
            !categorySlug ? "bg-maroon text-white border-maroon" : "border-maroon text-maroon"
          }`}
        >
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/shop?category=${c.slug}`}
            className={`px-4 py-2 rounded-full text-sm border ${
              categorySlug === c.slug ? "bg-maroon text-white border-maroon" : "border-maroon text-maroon"
            }`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      {products.length ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <p className="text-center text-ink-soft py-16 italic">
          No products found here yet — check back soon.
        </p>
      )}
    </div>
  );
}
