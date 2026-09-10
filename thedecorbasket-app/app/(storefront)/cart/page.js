"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/CartContext";
import { formatPrice, whatsappLink } from "@/lib/utils";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function CartPage() {
  const { items, removeItem, updateQty, total, clearCart } = useCart();
  const [whatsappNumber, setWhatsappNumber] = useState(null);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("homepage_settings")
      .select("whatsapp_number")
      .eq("id", 1)
      .single()
      .then(({ data }) => setWhatsappNumber(data?.whatsapp_number));
  }, []);

  const checkoutMessage =
    `Hi! I'd like to order:\n` +
    items
      .map((i) => `• ${i.name}${i.variantName ? ` (${i.variantName})` : ""} x${i.qty} — ${formatPrice(i.price)}`)
      .join("\n") +
    `\n\nTotal: ${formatPrice(total)}`;

  return (
    <div className="max-w-3xl mx-auto px-5 py-10">
      <h1 className="text-3xl mb-6">Your Cart</h1>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-ink-soft mb-6">Your cart is empty.</p>
          <Link href="/shop" className="btn btn-primary">Continue Shopping</Link>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-8">
            {items.map((item) => (
              <div key={item.key} className="flex items-center gap-4 bg-white p-3 rounded-sm card-shadow">
                <div className="w-16 h-16 relative bg-ivory-deep rounded-sm overflow-hidden flex-shrink-0">
                  {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  {item.variantName && <p className="text-sm text-ink-soft">{item.variantName}</p>}
                  <p className="text-maroon">{formatPrice(item.price)}</p>
                </div>
                <div className="flex items-center border border-maroon/25 rounded-sm">
                  <button className="px-2 py-1" onClick={() => updateQty(item.key, item.qty - 1)}>−</button>
                  <span className="px-2">{item.qty}</span>
                  <button className="px-2 py-1" onClick={() => updateQty(item.key, item.qty + 1)}>+</button>
                </div>
                <button onClick={() => removeItem(item.key)} className="text-copper text-sm">
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center border-t border-maroon/15 pt-4 mb-6">
            <span className="text-lg">Total</span>
            <span className="text-2xl font-display text-maroon">{formatPrice(total)}</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={whatsappLink(whatsappNumber, checkoutMessage)}
              target="_blank"
              rel="noopener"
              className="btn btn-whatsapp flex-1 justify-center"
            >
              Checkout via WhatsApp
            </a>
            <button onClick={clearCart} className="btn btn-outline">Clear Cart</button>
          </div>
          <p className="text-xs text-ink-soft mt-4">
            The Decor Basket doesn't process online payments yet — sending this cart on
            WhatsApp lets us confirm availability and arrange payment directly with you.
          </p>
        </>
      )}
    </div>
  );
}
