import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { calculateShipping } from "@/lib/shipping";

export function CartSummary({ subtotal }: { subtotal: number }) {
  const shipping = calculateShipping(subtotal);
  const total = subtotal + shipping;

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h2 className="text-lg font-semibold text-foreground">Order Summary</h2>

      <div className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Shipping</span>
          <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="flex justify-between text-base font-semibold text-foreground">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>

      <Button
        size="lg"
        disabled={subtotal === 0}
        className="mt-6 w-full"
        nativeButton={false}
        render={<Link href="/checkout" />}
      >
        Proceed to Checkout
      </Button>
    </div>
  );
}
