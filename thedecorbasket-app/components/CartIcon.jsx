"use client";

import Link from "next/link";
import { useCart } from "./CartContext";

export default function CartIcon() {
  const { count } = useCart();
  return (
    <Link href="/cart" className="relative text-lg" aria-label="Cart">
      🧺
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-maroon text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
          {count}
        </span>
      )}
    </Link>
  );
}
