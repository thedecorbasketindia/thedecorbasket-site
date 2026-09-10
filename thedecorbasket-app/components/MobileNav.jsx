"use client";

import { useState } from "react";
import Link from "next/link";

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        aria-label="Menu"
        onClick={() => setOpen((o) => !o)}
        className="text-2xl text-maroon leading-none"
      >
        ☰
      </button>
      {open && (
        <div className="absolute right-0 top-10 bg-ivory border border-maroon/10 rounded shadow-lg flex flex-col gap-3 p-5 w-48 text-sm z-50">
          <Link href="/" onClick={() => setOpen(false)}>Home</Link>
          <Link href="/shop" onClick={() => setOpen(false)}>Shop</Link>
          <Link href="/#about" onClick={() => setOpen(false)}>About</Link>
          <Link href="/#contact" onClick={() => setOpen(false)}>Contact</Link>
        </div>
      )}
    </div>
  );
}
