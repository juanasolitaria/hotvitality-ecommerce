import { Skeleton } from "@/components/ui/skeleton";

// Same proportions as ProductCard (square photo, 1-line title/description,
// price, full-width button) so the grid doesn't jump in height once the
// real cards render in.
export function ProductCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border">
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="mt-1 h-4 w-1/4" />
        <Skeleton className="mt-auto h-9 w-full" />
      </div>
    </div>
  );
}
