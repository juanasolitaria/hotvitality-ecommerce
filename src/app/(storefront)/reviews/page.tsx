import type { Metadata } from "next";

import { REVIEWS } from "@/lib/reviews-data";
import { ReviewCard } from "@/components/reviews/review-card";

export const metadata: Metadata = {
  title: "Reviews | HotVitality",
  description: "What our customers are saying about HotVitality.",
};

export default function ReviewsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-foreground">
        What Our Customers Say
      </h1>
      <p className="mt-2 text-muted-foreground">
        Feedback from buyers on eBay.
      </p>

      {/* CSS-columns masonry — no JS library needed. `break-inside-avoid`
          on each card keeps a card from getting split across two columns. */}
      <div className="mt-8 columns-1 gap-6 sm:columns-2 lg:columns-3">
        {REVIEWS.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            className="mb-6 break-inside-avoid"
          />
        ))}
      </div>
    </div>
  );
}
