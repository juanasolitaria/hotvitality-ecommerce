"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";

import type { Product } from "@/lib/types";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";

export function ProductInfo({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  function decrease() {
    setQuantity((prev) => Math.max(1, prev - 1));
  }

  function increase() {
    setQuantity((prev) => prev + 1);
  }

  function handleAddToCart() {
    addItem(product, quantity);
    toast.success(`${quantity} x ${product.name} added to cart`);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
        {product.name}
      </h1>
      <p className="mt-2 text-xl font-semibold text-primary">
        ${product.price.toFixed(2)}
      </p>

      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        {product.description}
      </p>

      {/* Quantity stepper + Add to Cart stack on mobile, sit side by side
          from `sm` up. */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex w-fit items-center rounded-lg border border-input">
          <button
            type="button"
            onClick={decrease}
            aria-label="Decrease quantity"
            className="flex size-9 items-center justify-center text-foreground hover:bg-accent disabled:opacity-40"
            disabled={quantity === 1}
          >
            <Minus className="size-4" />
          </button>
          <span className="w-8 text-center text-sm font-medium">
            {quantity}
          </span>
          <button
            type="button"
            onClick={increase}
            aria-label="Increase quantity"
            className="flex size-9 items-center justify-center text-foreground hover:bg-accent"
          >
            <Plus className="size-4" />
          </button>
        </div>

        <Button size="lg" onClick={handleAddToCart} className="sm:flex-1">
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
