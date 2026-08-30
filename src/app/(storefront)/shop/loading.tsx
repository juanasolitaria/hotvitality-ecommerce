import { ProductCardSkeleton } from "@/components/shop/product-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function ShopLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="mt-2 h-4 w-24" />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
