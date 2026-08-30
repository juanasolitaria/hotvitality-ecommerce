import { Skeleton } from "@/components/ui/skeleton";
import { TableSkeleton } from "@/components/admin/table-skeleton";

export default function AdminUsersLoading() {
  return (
    <div>
      <Skeleton className="h-7 w-20" />
      <Skeleton className="mt-2 h-4 w-24" />
      <TableSkeleton columns={4} rows={8} />
    </div>
  );
}
