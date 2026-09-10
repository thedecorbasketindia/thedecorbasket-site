import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";

export default function ProductCard({ product }) {
  const inStock = product.stock_status !== "out_of_stock";
  const image = product.primaryImage || "/logo.png";

  return (
    <Link
      href={`/product/${product.slug}`}
      className="bg-white rounded-sm overflow-hidden card-shadow flex flex-col group"
    >
      <div className="aspect-square bg-ivory-deep overflow-hidden relative">
        <Image
          src={image}
          alt={product.images?.[0]?.alt_text || product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        {!inStock && (
          <span className="absolute top-2 right-2 bg-copper text-white text-[10px] px-2 py-1 rounded">
            Out of stock
          </span>
        )}
        {product.on_sale && inStock && (
          <span className="absolute top-2 left-2 bg-maroon text-white text-[10px] px-2 py-1 rounded">
            Sale
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col gap-1 flex-1">
        {product.category?.name && (
          <span className="text-[11px] uppercase tracking-wide text-copper">
            {product.category.name}
          </span>
        )}
        <h3 className="font-display text-lg leading-snug">{product.name}</h3>
        <div className="mt-auto flex items-center gap-2 pt-2">
          <span className="font-display text-maroon text-xl">{formatPrice(product.price)}</span>
          {product.compare_at_price && (
            <span className="text-ink-soft text-sm line-through">
              {formatPrice(product.compare_at_price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
