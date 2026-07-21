import Link from "next/link";

import { Button } from "@/components/ui/button";
import { HeroCarousel } from "@/components/home/hero-carousel";

export function Hero() {
  return (
    // A dark-to-light green gradient instead of the old cream background —
    // gives the hero more visual depth while staying on-brand.
    <section className="bg-gradient-to-br from-[#0f2419] via-primary to-[#3f8465]">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-6 px-4 py-8 sm:px-6 md:grid-cols-2 md:py-12 lg:px-8">
        <div className="order-2 text-center md:order-1 md:text-left">
        {/* 1. H1 más grande (pasó de 2xl/3xl/4xl a 4xl/5xl/6xl) */}
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
          Fuel Your Everyday Vitality
        </h1>

        {/* 2. P más grande (pasó de text-sm/text-base a text-lg/text-xl) */}
        <p className="mx-auto mt-4 max-w-lg text-lg text-white/80 sm:text-xl md:mx-0">
          Premium, third-party tested supplements designed to support your
          energy, immunity, and long-term wellness — one habit at a time.
        </p>
          {/* "secondary" (cream on dark green text) stands out clearly
              against the dark gradient background, unlike the default
              primary button which would blend into it. */}
          <Button
            size="lg"
            variant="secondary"
            className="mt-5"
            nativeButton={false}
            render={<Link href="/shop" />}
          >
            Shop Now
          </Button>
        </div>

        <div className="order-1 md:order-2">
          <HeroCarousel />
        </div>
      </div>
    </section>
  );
}
