import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/shop/product-card";

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    // 2 columns on mobile, growing up to 4 on large screens — same
    // breakpoints as the homepage's featured grid for consistency.
    <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
