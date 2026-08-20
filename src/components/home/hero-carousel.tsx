"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

const SLIDES = [
  {
    src: "/hero/biqfel-portada.png",
    alt: "BIQ-FEL bottle with a special offer badge",
  },
  {
    src: "/hero/lineup.png",
    alt: "BIQ-FEL and other HotVitality supplement bottles lined up",
  },
  {
    src: "/hero/special-offer.jpg",
    alt: "Special offer promo for the HotVitality supplement lineup",
  },
];

const AUTOPLAY_DELAY_MS = 10000; // 10 seconds

// Same footprint as the old single hero image (aspect-[4/3], rounded-2xl)
// but cycles through a few lifestyle photos instead of showing just one.
export function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % SLIDES.length);
    }, AUTOPLAY_DELAY_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
      {SLIDES.map((slide, i) => (
        <div
          key={slide.src}
          aria-hidden={i !== index}
          className={cn(
            "absolute inset-0 transition-opacity duration-700 ease-in-out",
            i === index ? "opacity-100" : "opacity-0"
          )}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            priority={i === 0}
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      ))}    

      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Go to photo ${i + 1}`}
            className={cn(
              "size-1.5 rounded-full transition-all",
              i === index ? "w-4 bg-white" : "bg-white/50"
            )}
          />
        ))}
      </div>
    </div>
  );
}
