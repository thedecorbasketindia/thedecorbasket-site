import { notFound } from "next/navigation";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import { getCategoryBySlug, getProducts } from "@/lib/data";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};
  return {
    title: `${category.name} — The Decor Basket`,
    description: category.description || undefined,
  };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category || !category.enabled) notFound();

  const products = await getProducts({ categorySlug: slug });

  return (
    <div className="max-w-6xl mx-auto px-5 py-10">
      {category.image_url && (
        <div className="relative w-full h-48 md:h-64 rounded-sm overflow-hidden mb-6">
          <Image src={category.image_url} alt={category.name} fill className="object-cover" />
        </div>
      )}
      <h1 className="text-3xl mb-2">{category.name}</h1>
      {category.description && <p className="text-ink-soft mb-8">{category.description}</p>}

      {products.length ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <p className="text-center text-ink-soft py-16 italic">
          No products in this category yet.
        </p>
      )}
    </div>
  );
}
