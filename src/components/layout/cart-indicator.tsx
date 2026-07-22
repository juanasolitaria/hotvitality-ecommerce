"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";

// Split out from Header so only this small piece needs to be a Client
// Component (to read the live cart count) — the rest of the header can
// stay a Server Component.
export function CartIndicator() {
  const { itemCount } = useCart();

  return (
    <Button
      render={<Link href="/cart" />}
      nativeButton={false}
      variant="ghost"
      size="icon"
      className="relative"
    >
      <ShoppingCart className="size-5" />
      {itemCount > 0 && (
        <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
          {itemCount}
        </span>
      )}
      <span className="sr-only">Cart</span>
    </Button>
  );
}
