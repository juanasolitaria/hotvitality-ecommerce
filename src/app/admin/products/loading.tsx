import { Skeleton } from "@/components/ui/skeleton";
import { TableSkeleton } from "@/components/admin/table-skeleton";

export default function AdminProductsLoading() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-7 w-28" />
        <Skeleton className="h-9 w-32" />
      </div>
      <TableSkeleton columns={5} rows={8} />
    </div>
  );
}
