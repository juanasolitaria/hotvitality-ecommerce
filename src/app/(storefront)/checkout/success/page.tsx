import { redirect } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { createClient as createServiceClient } from "@supabase/supabase-js";

import { stripe } from "@/lib/stripe";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ClearCartOnMount } from "@/components/checkout/clear-cart-on-mount";

// Same reasoning as checkout/actions.ts: this page needs to read an order
// that may belong to a guest (no session at all), so it reads with the
// service-role client rather than the per-request one. What makes this
// safe is that you can only land here with a real Stripe Checkout Session
// id, which Stripe itself put in the redirect URL after a completed
// payment — not something a visitor can just guess or forge.
function adminClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

interface OrderItemRow {
  product_name: string;
  unit_price: number;
  quantity: number;
}

interface CheckoutSuccessPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function CheckoutSuccessPage({
  searchParams,
}: CheckoutSuccessPageProps) {
  const { session_id: sessionId } = await searchParams;
  if (!sessionId) redirect("/checkout");

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const orderId = session.metadata?.orderId;

  // If Stripe says this session wasn't actually paid, don't show a
  // confirmation — send them back rather than trusting the URL alone.
  if (!orderId || session.payment_status !== "paid") {
    redirect("/checkout");
  }

  const db = adminClient();
  const { data: order } = await db
    .from("orders")
    .select(
      "id, customer_email, subtotal, total, order_items(product_name, unit_price, quantity)"
    )
    .eq("id", orderId)
    .single<{
      id: string;
      customer_email: string;
      subtotal: number;
      total: number;
      order_items: OrderItemRow[];
    }>();

  if (!order) redirect("/checkout");

  const shipping = order.total - order.subtotal;

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6">
      {/* Renders nothing — just empties the cart now that payment's confirmed. */}
      <ClearCartOnMount />

      <CheckCircle2 className="mx-auto size-12 text-primary" />
      <h1 className="mt-4 text-xl font-semibold text-foreground">
        Payment successful!
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Order <span className="font-medium text-foreground">{order.id}</span>{" "}
        — we&apos;ll email you at {order.customer_email} once it ships.
      </p>

      <div className="mt-6 rounded-2xl border border-border bg-card p-6 text-left">
        {order.order_items.map((item, i) => (
          <div key={i} className="flex justify-between py-1 text-sm">
            <span className="text-muted-foreground">
              {item.quantity} &times; {item.product_name}
            </span>
            <span className="text-foreground">
              ${(item.unit_price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
        <Separator className="my-3" />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Subtotal</span>
          <span>${order.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Shipping</span>
          <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
        </div>
        <Separator className="my-3" />
        <div className="flex justify-between text-base font-semibold text-foreground">
          <span>Total</span>
          <span>${order.total.toFixed(2)}</span>
        </div>
      </div>

      <Button
        className="mt-6 w-full"
        nativeButton={false}
        render={<Link href="/shop" />}
      >
        Continue Shopping
      </Button>
    </div>
  );
}
