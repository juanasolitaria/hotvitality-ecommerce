import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Reused by every /admin/* list page (Orders, Payments, Users) — they all
// share the same "Card wrapping a Table" shape, just with a different
// number of columns/rows.
export function TableSkeleton({
  columns = 5,
  rows = 6,
}: {
  columns?: number;
  rows?: number;
}) {
  return (
    <Card className="mt-6">
      <CardContent className="overflow-x-auto">
        <div className="flex flex-col gap-4">
          <div className="flex gap-4 border-b border-border pb-3">
            {Array.from({ length: columns }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-24" />
            ))}
          </div>
          {Array.from({ length: rows }).map((_, row) => (
            <div key={row} className="flex gap-4">
              {Array.from({ length: columns }).map((_, col) => (
                <Skeleton key={col} className="h-4 w-24" />
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
