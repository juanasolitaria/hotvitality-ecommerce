import { cn } from "@/lib/utils";

// Pulsing placeholder block used by every route's loading.tsx — size and
// shape it with className to match whatever content it's standing in for.
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

export { Skeleton };
