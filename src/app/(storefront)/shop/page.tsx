import type { Metadata } from "next";

import { getProducts } from "@/lib/supabase/products";
import { ProductGrid } from "@/components/shop/product-grid";

export const metadata: Metadata = {
  title: "Shop | HotVitality",
};

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          Shop All Supplements
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {products.length} products
        </p>
      </div>

      <ProductGrid products={products} />
    </div>
  );
}
