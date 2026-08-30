import { Skeleton } from "@/components/ui/skeleton";
import { TableSkeleton } from "@/components/admin/table-skeleton";

export default function AdminPaymentsLoading() {
  return (
    <div>
      <Skeleton className="h-7 w-28" />
      <Skeleton className="mt-2 h-4 w-72" />
      <TableSkeleton columns={6} rows={8} />
    </div>
  );
}
