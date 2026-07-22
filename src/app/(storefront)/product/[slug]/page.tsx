import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { getProductBySlug } from "@/lib/supabase/products";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductInfo } from "@/components/product/product-info";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  return { title: product ? `${product.name} | Hot Vitality` : "Hot Vitality" };
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Stacked on mobile, two columns from `md` up. */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
        <ProductGallery images={product.images} alt={product.name} />
        <ProductInfo product={product} />
      </div>
    </div>
  );
}
