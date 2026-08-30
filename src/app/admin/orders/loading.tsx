import { Skeleton } from "@/components/ui/skeleton";
import { TableSkeleton } from "@/components/admin/table-skeleton";

export default function AdminOrdersLoading() {
  return (
    <div>
      <Skeleton className="h-7 w-24" />
      <Skeleton className="mt-2 h-4 w-72" />
      <TableSkeleton columns={7} rows={8} />
    </div>
  );
}
