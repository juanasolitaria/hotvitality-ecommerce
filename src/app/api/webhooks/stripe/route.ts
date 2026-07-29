import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { createClient as createServiceClient } from "@supabase/supabase-js";

import { stripe } from "@/lib/stripe";

// Stripe calls this URL directly (not the browser), so there's no user
// session/cookies here — it has to use the service-role client. The
// signature check below is what proves a request genuinely came from
// Stripe and wasn't someone hitting this endpoint to mark orders "paid"
// for free.
function adminClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      const db = adminClient();
      await db
        .from("orders")
        .update({
          status: "paid",
          stripe_payment_intent_id:
            typeof session.payment_intent === "string"
              ? session.payment_intent
              : session.payment_intent?.id ?? null,
        })
        .eq("id", orderId);
    }
  }

  return NextResponse.json({ received: true });
}
