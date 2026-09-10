import { notFound } from "next/navigation";
import ProductDetail from "@/components/ProductDetail";
import ProductCard from "@/components/ProductCard";
import { getProductBySlug, getRelatedProducts, getHomepageSettings } from "@/lib/data";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.meta_title || `${product.name} — The Decor Basket`,
    description: product.meta_description || product.short_description || undefined,
    openGraph: product.primaryImage ? { images: [product.primaryImage] } : undefined,
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const [product, settings] = await Promise.all([
    getProductBySlug(slug),
    getHomepageSettings(),
  ]);
  if (!product) notFound();

  const related = await getRelatedProducts(product.category_id, product.id);

  return (
    <div className="max-w-6xl mx-auto px-5 py-10">
      <ProductDetail product={product} whatsappNumber={settings?.whatsapp_number} />

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl mb-5">You may also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
