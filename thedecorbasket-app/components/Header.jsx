import Link from "next/link";
import Image from "next/image";
import MobileNav from "./MobileNav";
import CartIcon from "./CartIcon";

export default function Header({ settings }) {
  const logo = settings?.logo_url || "/logo.png";
  const siteTitle = settings?.site_title || "The Decor Basket";

  return (
    <header className="sticky top-0 z-50 bg-ivory border-b border-maroon/10">
      {settings?.announcement_active && settings?.announcement_text ? (
        <div className="bg-maroon text-ivory text-center text-xs sm:text-sm py-2 px-4 font-body">
          {settings.announcement_text}
        </div>
      ) : null}

      <div className="max-w-6xl mx-auto flex items-center justify-between px-5 py-3">
        <nav className="hidden md:flex items-center gap-8 text-sm flex-1">
          <Link href="/" className="hover:text-maroon">Home</Link>
          <Link href="/shop" className="hover:text-maroon">Shop</Link>
        </nav>

        <Link href="/" className="flex-1 flex justify-center md:flex-none">
          <Image
            src={logo}
            alt={siteTitle}
            width={220}
            height={70}
            className="h-12 w-auto object-contain"
            priority
          />
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm flex-1 justify-end">
          <Link href="/#about" className="hover:text-maroon">About</Link>
          <Link href="/#contact" className="hover:text-maroon">Contact</Link>
          <CartIcon />
        </div>

        <div className="flex md:hidden items-center gap-3">
          <CartIcon />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
