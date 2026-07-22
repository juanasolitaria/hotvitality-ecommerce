"use client";

import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

import type { Product } from "@/lib/types";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  function handleAddToCart() {
    addItem(product);
    toast.success(`${product.name} added to cart`);
  }

  return (
    <Card size="sm" className="group relative overflow-hidden pt-0">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-square w-full overflow-hidden rounded-t-xl bg-muted">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>

      <CardContent>
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-sm font-semibold text-foreground">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
          {product.shortDescription}
        </p>
        <p className="mt-2 text-sm font-semibold text-primary">
          ${product.price.toFixed(2)}
        </p>
      </CardContent>

      <CardFooter className="border-t-0 bg-transparent p-4 pt-0">
        <Button onClick={handleAddToCart} className="w-full">
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
