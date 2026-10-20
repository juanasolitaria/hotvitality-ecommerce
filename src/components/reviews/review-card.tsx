import { Star } from "lucide-react";

import type { Review } from "@/lib/reviews-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function ReviewCard({
  review,
  className,
}: {
  review: Review;
  className?: string;
}) {
  return (
    <Card className={cn(className)}>
      <CardContent className="flex flex-col gap-3">
        <Badge className="w-fit">
          {review.product} &middot; x{review.quantity}
        </Badge>
        <div className="flex gap-0.5">
          {Array.from({ length: review.rating }).map((_, i) => (
            <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          {review.name} &middot; Verified Purchase
        </p>
        <p className="text-sm text-foreground">&ldquo;{review.text}&rdquo;</p>
      </CardContent>
    </Card>
  );
}
