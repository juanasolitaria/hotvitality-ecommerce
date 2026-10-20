import { Hero } from "@/components/home/hero";
import { FeaturedProducts } from "@/components/home/featured-products";
import { ReviewsSection } from "@/components/home/reviews-section";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <ReviewsSection />
    </>
  );
}
