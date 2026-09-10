import Image from "next/image";
import Link from "next/link";
import HeroCarousel from "@/components/HeroCarousel";
import ProductCard from "@/components/ProductCard";
import { getHomepageSettings, getHeroSlides, getProducts } from "@/lib/data";

export default async function HomePage() {
  const [settings, slides, featured] = await Promise.all([
    getHomepageSettings(),
    getHeroSlides(),
    getProducts({ featured: true, limit: 12 }),
  ]);

  const products = featured.length ? featured : await getProducts({ limit: 12 });

  return (
    <>
      {slides.length > 0 ? (
        <HeroCarousel slides={slides} />
      ) : (
        <section className="relative w-full h-[380px] md:h-[500px] bg-ivory-deep flex items-center justify-center text-center px-6">
          {settings?.hero_image && (
            <Image
              src={settings.hero_image}
              alt={settings?.hero_headline || "The Decor Basket"}
              fill
              priority
              className="object-cover"
            />
          )}
          <div
            className="absolute inset-0"
            style={{ background: `rgba(0,0,0,${settings?.hero_overlay ?? 0.25})` }}
          />
          <div className="relative max-w-2xl">
            <h1 className="text-white text-3xl md:text-5xl mb-3">
              {settings?.hero_headline || "Thoughtfully Curated. Beautifully Made."}
            </h1>
            {settings?.hero_subheadline && (
              <p className="text-white/90 mb-5 text-base md:text-lg">{settings.hero_subheadline}</p>
            )}
            <Link href={settings?.hero_cta_url || "/shop"} className="btn btn-primary">
              {settings?.hero_cta_text || "Shop the Collection"}
            </Link>
          </div>
        </section>
      )}

      <section className="max-w-6xl mx-auto px-5 py-14">
        {products.length ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <p className="text-center text-ink-soft py-10">
            Products will appear here as soon as they're published from the admin dashboard.
          </p>
        )}
        <div className="text-center mt-10">
          <Link href="/shop" className="btn btn-outline">View Full Collection</Link>
        </div>
      </section>

      <section id="about" className="bg-ivory-deep py-16">
        <div className="max-w-3xl mx-auto px-5 text-center">
          <h2 className="text-3xl mb-3">{settings?.tagline || "Curated with Care, Styled with Love"}</h2>
          <p className="text-ink-soft">
            The Decor Basket brings together home decor, wooden craft, fashion, candles and
            more — every piece chosen to add a little more warmth to everyday life.
          </p>
        </div>
      </section>
    </>
  );
}
