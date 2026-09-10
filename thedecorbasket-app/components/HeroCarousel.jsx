"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function HeroCarousel({ slides }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [slides.length]);

  const slide = slides[index];
  if (!slide) return null;

  return (
    <div className="relative w-full h-[420px] md:h-[560px] overflow-hidden bg-ivory-deep">
      <Image
        src={slide.image_url}
        alt={slide.headline || "The Decor Basket"}
        fill
        priority
        className="object-cover"
      />
      <div
        className="absolute inset-0 bg-black flex items-center justify-center text-center px-6"
        style={{ opacity: 0 }}
      />
      <div
        className="absolute inset-0 flex items-center justify-center text-center px-6"
        style={{
          background: `rgba(0,0,0,${slide.overlay_strength ?? 0.25})`,
        }}
      >
        <div className="max-w-2xl">
          {slide.headline && (
            <h1 className="text-white text-3xl md:text-5xl mb-3">{slide.headline}</h1>
          )}
          {slide.subtitle && (
            <p className="text-white/90 mb-5 text-base md:text-lg">{slide.subtitle}</p>
          )}
          {slide.cta_text && slide.cta_url && (
            <Link href={slide.cta_url} className="btn btn-primary">
              {slide.cta_text}
            </Link>
          )}
        </div>
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setIndex(i)}
              className={`w-2 h-2 rounded-full ${i === index ? "bg-white" : "bg-white/40"}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
