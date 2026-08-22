import Link from "next/link";

import { getProducts } from "@/lib/supabase/products";
import { ProductCard } from "@/components/shop/product-card";
import { Button } from "@/components/ui/button";

export async function FeaturedProducts() {
  const products = await getProducts();

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">
          Bestsellers For You
        </h2>
        <Button variant="link" nativeButton={false} render={<Link href="/shop" />}>
          View all
        </Button>
      </div>

      {/* 2 columns on mobile, growing up to 4 on large screens. */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
