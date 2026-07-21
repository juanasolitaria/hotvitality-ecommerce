"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { toast } from "sonner";

import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export function ProductCard({ product }: { product: Product }) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  // There's no real cart yet (no Supabase/state store), so "Add to Cart"
  // just confirms the click with a toast for now.
  function handleAddToCart() {
    toast.success(`${product.name} added to cart`);
  }

  return (
    <Card size="sm" className="group relative overflow-hidden">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-square w-full overflow-hidden bg-muted">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>

      <button
        type="button"
        onClick={() => setIsWishlisted((prev) => !prev)}
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        aria-pressed={isWishlisted}
        className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm"
      >
        <Heart
          className="size-4"
          fill={isWishlisted ? "currentColor" : "none"}
        />
      </button>

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

      <CardFooter className="bg-transparent p-4 pt-0">
        <Button onClick={handleAddToCart} className="w-full">
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
