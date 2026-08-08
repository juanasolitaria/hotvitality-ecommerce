import type { Metadata } from "next";
import { createClient as createServiceClient } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export const metadata: Metadata = {
  title: "Checkout | HotVitality",
};

// Same reasoning as checkout/success/page.tsx: marking an order cancelled
// has no session to check against for a guest, so it uses the
// service-role client. Safe because we only ever move an order from
// `pending` to `cancelled` (the .eq("status", "pending") below), and only
// after confirming with Stripe itself that the session wasn't paid.
function adminClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// Runs when Stripe sends someone back here via cancel_url. Marks the
// order `cancelled` right away instead of leaving it stuck on `pending` —
// the webhook's `checkout.session.expired` handler is only a fallback for
// customers who close the tab instead of coming back through this page.
async function cancelOrder(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const orderId = session.metadata?.orderId;
  if (!orderId || session.payment_status === "paid") return;

  const db = adminClient();
  const { error } = await db
    .from("orders")
    .update({ status: "cancelled" })
    .eq("id", orderId)
    .eq("status", "pending");

  if (error) {
    console.error("Failed to cancel order:", error.message);
  }
}

interface CheckoutPageProps {
  searchParams: Promise<{ canceled?: string; session_id?: string }>;
}

export default async function CheckoutPage({
  searchParams,
}: CheckoutPageProps) {
  const { canceled, session_id: sessionId } = await searchParams;

  if (canceled === "true" && sessionId) {
    await cancelOrder(sessionId);
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Prefill the form for logged-in customers; guests just get blank
  // fields. Either way `createCheckoutSession` accepts the checkout.
  let initialName = "";
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();
    initialName = profile?.full_name ?? "";
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
        Checkout
      </h1>

      {canceled === "true" && (
        <p className="mt-4 rounded-lg border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
          Payment was canceled — your order wasn&apos;t charged. You can pick
          up where you left off below.
        </p>
      )}

      <CheckoutForm initialName={initialName} initialEmail={user?.email ?? ""} />
    </div>
  );
}
