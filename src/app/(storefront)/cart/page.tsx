"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import { useCart } from "@/lib/cart-context";
import { CartItem } from "@/components/cart/cart-item";
import { CartSummary } from "@/components/cart/cart-summary";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-20 text-center sm:px-6 lg:px-8">
        <ShoppingBag className="size-12 text-muted-foreground" />
        <h1 className="mt-4 text-xl font-semibold text-foreground">
          Your cart is empty
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Looks like you haven&apos;t added anything yet.
        </p>
        <Button className="mt-6" nativeButton={false} render={<Link href="/shop" />}>
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
        Your Cart
      </h1>

      {/* Items list and summary stack on mobile; summary becomes a
          sticky sidebar from `lg` up. */}
      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {items.map((item) => (
            <CartItem
              key={item.product.id}
              item={item}
              onIncrease={(id) => updateQuantity(id, item.quantity + 1)}
              onDecrease={(id) => updateQuantity(id, item.quantity - 1)}
              onRemove={removeItem}
            />
          ))}
        </div>

        <div className="lg:sticky lg:top-20 lg:h-fit">
          <CartSummary subtotal={subtotal} />
        </div>
      </div>
    </div>
  );
}
