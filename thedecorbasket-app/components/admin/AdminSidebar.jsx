"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/admin/auth-actions";

const NAV = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/collections", label: "Collections" },
  { href: "/admin/homepage", label: "Homepage" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 bg-white border-r border-black/10 min-h-screen p-5 flex flex-col">
      <div className="mb-8">
        <p className="font-semibold text-sm">The Decor Basket</p>
        <p className="text-xs text-gray-500">Admin</p>
      </div>
      <nav className="flex flex-col gap-1 flex-1">
        {NAV.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-2 rounded text-sm ${
                active ? "bg-[#7C0E2A] text-white" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <Link href="/" target="_blank" className="text-xs text-gray-500 mb-3 hover:underline">
        View live site ↗
      </Link>
      <form action={logout}>
        <button type="submit" className="text-xs text-gray-500 hover:underline">
          Sign out
        </button>
      </form>
    </aside>
  );
}
