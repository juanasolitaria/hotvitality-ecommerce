import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/shop/product-card";

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    // 2 columns on mobile, growing up to 3 on large screens — one fewer
    // column than before so each card (and its square photo) renders
    // noticeably bigger.
    <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
