import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { getProductBySlug, products } from "@/data/products";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductInfo } from "@/components/product/product-info";

// Pre-renders one static page per product at build time instead of on
// every request, since our product list doesn't change (it's mock data).
export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const product = getProductBySlug(params.slug);
  return { title: product ? `${product.name} | Hot Vitality` : "Hot Vitality" };
}

export default function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Stacked on mobile, two columns from `md` up. */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
        <ProductGallery image={product.image} alt={product.name} />
        <ProductInfo product={product} />
      </div>
    </div>
  );
}
