import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { createClient as createServiceClient } from "@supabase/supabase-js";

import { stripe } from "@/lib/stripe";
import { sendOrderConfirmationEmail } from "@/lib/email/order-confirmation";
import { sendAdminOrderEmail } from "@/lib/email/admin-order-notification";
import { sendAdminOrderNotification } from "@/lib/telegram";

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
      // .select() after .update() returns the updated row (plus its items,
      // via the order_items relationship) in the same round trip — enough
      // to build the confirmation email without a second query.
      // The .eq("status", "pending") guard makes this idempotent: Stripe
      // can and does redeliver the same event more than once, and without
      // this filter a redelivery would re-send the confirmation email to
      // the customer every time. Once an order is already "paid", the
      // filter matches zero rows and .maybeSingle() just returns null.
      const { data: order, error } = await db
        .from("orders")
        .update({
          status: "paid",
          stripe_payment_intent_id:
            typeof session.payment_intent === "string"
              ? session.payment_intent
              : session.payment_intent?.id ?? null,
        })
        .eq("id", orderId)
        .eq("status", "pending")
        .select(
          "customer_name, customer_email, subtotal, total, shipping_address, order_items(product_id, product_name, unit_price, quantity)"
        )
        .maybeSingle();

      // Returning a 500 here (instead of swallowing the error) makes
      // Stripe automatically retry this webhook on its usual backoff
      // schedule, instead of us silently losing the "mark as paid" update.
      if (error) {
        console.error("Failed to mark order as paid:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      // order is null when this event was already processed (order was
      // no longer "pending") — a Stripe redelivery, so skip both sends.
      if (order) {
        // Best-effort, same as the email/Telegram sends below: the order
        // is already paid at this point, which is what matters most, and
        // a redelivered event won't retry this anyway (the .eq("status",
        // "pending") guard above means `order` will be null next time), so
        // there's no retry to preserve by throwing here instead of logging.
        const stockResults = await Promise.all(
          order.order_items.map((item) =>
            db.rpc("decrement_product_stock", {
              p_product_id: item.product_id,
              p_quantity: item.quantity,
            })
          )
        );
        for (const { error: stockError } of stockResults) {
          if (stockError) {
            console.error("Failed to decrement product stock:", stockError.message);
          }
        }

        // Best-effort, run together: the order is already paid at this
        // point, which is what matters. All three functions log their own
        // errors instead of throwing, so a Resend or Telegram outage
        // doesn't turn into a Stripe webhook retry.
        await Promise.all([
          sendOrderConfirmationEmail({
            orderId,
            customerName: order.customer_name,
            customerEmail: order.customer_email,
            subtotal: order.subtotal,
            total: order.total,
            items: order.order_items,
          }),
          sendAdminOrderEmail({
            orderId,
            customerName: order.customer_name,
            customerEmail: order.customer_email,
            total: order.total,
            items: order.order_items,
            shippingAddress: order.shipping_address,
          }),
          sendAdminOrderNotification({
            orderId,
            customerName: order.customer_name,
            customerEmail: order.customer_email,
            total: order.total,
            items: order.order_items,
            shippingAddress: order.shipping_address,
          }),
        ]);
      }
    }
  }

  // Fires ~24h after a Checkout Session is created if it was never paid —
  // covers customers who close the tab instead of clicking "back", which
  // the cancel_url redirect (checkout/page.tsx) never sees. Only touches
  // orders still `pending`, so it can't ever undo a real payment.
  if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      const db = adminClient();
      const { error } = await db
        .from("orders")
        .update({ status: "cancelled" })
        .eq("id", orderId)
        .eq("status", "pending");

      if (error) {
        console.error("Failed to mark expired order as cancelled:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
