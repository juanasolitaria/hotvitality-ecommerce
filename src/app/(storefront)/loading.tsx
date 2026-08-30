import { ProductCardSkeleton } from "@/components/shop/product-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

// Shown while the home page's FeaturedProducts (an async Server Component)
// fetches products — Next.js replaces this whole segment's output with
// this file until that resolves, so the static Hero gets a rough stand-in
// too, otherwise it'd pop in a beat after this skeleton disappears.
export default function HomeLoading() {
  return (
    <>
      <section className="bg-gradient-to-br from-[#0f2419] via-primary to-[#3f8465]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-6 px-4 py-8 sm:px-6 md:grid-cols-2 md:py-12 lg:px-8">
          <div className="order-2 flex flex-col items-center gap-4 md:order-1 md:items-start">
            <Skeleton className="h-10 w-full max-w-md bg-white/20" />
            <Skeleton className="h-4 w-full max-w-sm bg-white/20" />
            <Skeleton className="h-10 w-32 bg-white/20" />
          </div>
          <div className="order-1 md:order-2">
            <Skeleton className="aspect-square w-full bg-white/20 sm:aspect-video" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-5 w-16" />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </>
  );
}
