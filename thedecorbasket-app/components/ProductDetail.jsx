"use client";

import { useState } from "react";
import Image from "next/image";
import { formatPrice, whatsappLink } from "@/lib/utils";
import { useCart } from "@/components/CartContext";

export default function ProductDetail({ product, whatsappNumber }) {
  const images = product.images?.length ? product.images : [{ url: product.primaryImage }];
  const [activeImage, setActiveImage] = useState(images[0]?.url);
  const [variant, setVariant] = useState(
    product.variants?.find((v) => v.available) || null
  );
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const price = variant?.price ?? product.price;
  const inStock =
    product.stock_status !== "out_of_stock" && (!variant || variant.available);

  function handleAddToCart() {
    addItem(product, variant, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  const enquiryMessage = `Hi! I'm interested in "${product.name}"${
    variant ? ` (${variant.name})` : ""
  } from The Decor Basket.`;

  return (
    <div className="grid md:grid-cols-2 gap-10">
      <div>
        <div className="aspect-square relative bg-ivory-deep rounded-sm overflow-hidden mb-3">
          {activeImage && (
            <Image src={activeImage} alt={product.name} fill className="object-cover" />
          )}
        </div>
        {images.length > 1 && (
          <div className="flex gap-2 flex-wrap">
            {images.map((img) => (
              <button
                key={img.url}
                onClick={() => setActiveImage(img.url)}
                className={`w-16 h-16 relative rounded-sm overflow-hidden border ${
                  activeImage === img.url ? "border-maroon" : "border-transparent"
                }`}
              >
                <Image src={img.url} alt={img.alt_text || product.name} fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        {product.category?.name && (
          <span className="text-xs uppercase tracking-wide text-copper">{product.category.name}</span>
        )}
        <h1 className="text-3xl mt-1 mb-2">{product.name}</h1>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl font-display text-maroon">{formatPrice(price)}</span>
          {product.compare_at_price && (
            <span className="text-ink-soft line-through">{formatPrice(product.compare_at_price)}</span>
          )}
        </div>

        {product.short_description && <p className="mb-4">{product.short_description}</p>}
        {product.full_description && (
          <p className="text-ink-soft mb-6 whitespace-pre-line">{product.full_description}</p>
        )}

        {product.variants?.length > 0 && (
          <div className="mb-6">
            <p className="text-sm mb-2 font-medium">Options</p>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  disabled={!v.available}
                  onClick={() => setVariant(v)}
                  className={`px-4 py-2 rounded-full text-sm border flex items-center gap-2 ${
                    variant?.id === v.id ? "border-maroon bg-maroon/5" : "border-maroon/25"
                  } ${!v.available ? "opacity-40 cursor-not-allowed" : ""}`}
                >
                  {v.hex_color && (
                    <span
                      className="w-3 h-3 rounded-full inline-block border border-black/10"
                      style={{ background: v.hex_color }}
                    />
                  )}
                  {v.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {!inStock ? (
          <p className="text-copper font-medium mb-4">Currently out of stock</p>
        ) : (
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center border border-maroon/25 rounded-sm">
              <button className="px-3 py-2" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
              <span className="px-3">{qty}</span>
              <button className="px-3 py-2" onClick={() => setQty((q) => q + 1)}>+</button>
            </div>
            <button onClick={handleAddToCart} className="btn btn-primary">
              {added ? "Added ✓" : "Add to Cart"}
            </button>
          </div>
        )}

        <a
          href={whatsappLink(whatsappNumber, enquiryMessage)}
          target="_blank"
          rel="noopener"
          className="btn btn-whatsapp w-full justify-center"
        >
          Enquire on WhatsApp
        </a>
      </div>
    </div>
  );
}
