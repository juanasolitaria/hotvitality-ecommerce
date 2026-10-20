"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

type Slide =
  | { type: "image"; src: string; alt: string }
  | { type: "video"; src: string; alt: string };

const SLIDES: Slide[] = [
  {
    type: "image",
    src: "/hero/lineup.png",
    alt: "BIQ-FEL and other HotVitality supplement bottles lined up",
  },
  {
    type: "video",
    src: "/hero/carousel-2.mp4",
    alt: "Customers enjoying HotVitality supplements",
  },
  {
    type: "image",
    src: "/hero/carousel-1.png",
    alt: "Customer holding a KLG Borojo Chontaduro Maca bottle",
  },
  {
    type: "image",
    src: "/hero/special-offer.jpg",
    alt: "Special offer promo for the HotVitality supplement lineup",
  },    
];

const AUTOPLAY_DELAY_MS = 6000; // image slides only — the video slide
// advances itself when it finishes playing (see the effect below), so it
// always shows its full length instead of being cut off at a fixed time.

// Same footprint as the old single hero image (aspect-[4/3], rounded-2xl)
// but cycles through a few lifestyle photos — and now one video — instead
// of showing just one.
export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  function goToNext() {
    setIndex((prev) => (prev + 1) % SLIDES.length);
  }

  useEffect(() => {
    const current = SLIDES[index];

    if (current.type === "video") {
      // Always restart from the beginning — a slide that already played
      // once and looped back around shouldn't resume mid-way through.
      const video = videoRef.current;
      if (video) {
        video.currentTime = 0;
        video.play().catch(() => {});
      }
      return; // onEnded below drives the advance to the next slide
    }

    // Leaving the video slide (or it was never reached) — make sure it's
    // not silently still playing in the background.
    videoRef.current?.pause();

    const timer = setTimeout(goToNext, AUTOPLAY_DELAY_MS);
    return () => clearTimeout(timer);
  }, [index]);

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
          {slide.type === "image" ? (
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={i === 0}
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          ) : (
            <video
              ref={videoRef}
              src={slide.src}
              muted
              playsInline
              onEnded={goToNext}
              aria-label={slide.alt}
              className="size-full object-cover"
            />
          )}
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
