"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

// Beyond this many thumbnails, the last visible one gets a "+N" overlay
// instead of the strip just growing forever.
const MAX_VISIBLE_THUMBS = 5;

export function ProductGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [index, setIndex] = useState(0);

  const hasMultiple = images.length > 1;
  const hiddenCount = images.length - MAX_VISIBLE_THUMBS;
  const visibleThumbs =
    hiddenCount > 0 ? images.slice(0, MAX_VISIBLE_THUMBS) : images;

  return (
    // items-start on the row layout stops flex's default stretch
    // behavior from overriding the main photo's aspect-square height —
    // without it, the grid on the product page stretches this whole
    // component to match ProductInfo's height, and flex stretch was
    // passing that height straight down into the image.
    <div className="flex flex-col-reverse gap-3 md:flex-row md:items-start">
      {/* Thumbnail strip: horizontal below the main photo on mobile,
          a vertical column to its left from `md` up. */}
      {hasMultiple && (
        <div className="flex gap-2 overflow-x-auto md:max-h-[520px] md:w-20 md:shrink-0 md:flex-col md:overflow-x-visible md:overflow-y-auto">
          {visibleThumbs.map((image, i) => {
            const isLastVisible = i === visibleThumbs.length - 1;
            const showMoreOverlay = isLastVisible && hiddenCount > 0;

            return (
              <button
                key={image}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={
                  showMoreOverlay
                    ? `View ${hiddenCount} more photos`
                    : `View photo ${i + 1} of ${images.length}`
                }
                className={cn(
                  "relative size-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors md:size-20",
                  i === index ? "border-primary" : "border-transparent"
                )}
              >
                <Image
                  src={image}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                />
                {showMoreOverlay && (
                  <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-sm font-semibold text-white">
                    +{hiddenCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-muted">
        <Image
          src={images[index]}
          alt={alt}
          fill
          priority
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />

        {hasMultiple && (
          <>
            {index > 0 && (
              <button
                type="button"
                onClick={() => setIndex((i) => i - 1)}
                aria-label="Previous photo"
                className="absolute top-1/2 left-3 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/60"
              >
                <ChevronLeft className="size-5" />
              </button>
            )}
            {index < images.length - 1 && (
              <button
                type="button"
                onClick={() => setIndex((i) => i + 1)}
                aria-label="Next photo"
                className="absolute top-1/2 right-3 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/60"
              >
                <ChevronRight className="size-5" />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
