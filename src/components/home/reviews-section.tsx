import Link from "next/link";

import { FEATURED_REVIEWS } from "@/lib/reviews-data";
import { ReviewCard } from "@/components/reviews/review-card";
import { Button } from "@/components/ui/button";

export function ReviewsSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">
          What Our Customers Say
        </h2>
        <Button
          variant="link"
          nativeButton={false}
          render={<Link href="/reviews" />}
        >
          See more reviews
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        {FEATURED_REVIEWS.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </section>
  );
}
