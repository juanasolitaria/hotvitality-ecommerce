import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const FREE_SHIPPING_THRESHOLD = 50;
const FLAT_SHIPPING_RATE = 5.99;

export function CartSummary({ subtotal }: { subtotal: number }) {
  const shipping =
    subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD
      ? 0
      : FLAT_SHIPPING_RATE;
  const total = subtotal + shipping;

  // Checkout (Stripe) isn't wired up yet during this UI-only phase.
  function handleCheckout() {
    toast.info("Checkout is coming soon!");
  }

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
        onClick={handleCheckout}
        disabled={subtotal === 0}
        className="mt-6 w-full"
      >
        Proceed to Checkout
      </Button>
    </div>
  );
}
