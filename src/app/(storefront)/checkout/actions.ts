"use server";

import { headers } from "next/headers";
import { createClient as createServiceClient } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";
import { calculateShipping } from "@/lib/shipping";
import type { ShippingAddress } from "@/lib/types";

// Postgres re-checks the `orders_select_own_or_admin` policy against a
// row's final values whenever an INSERT asks for it back via RETURNING
// (which `.select()` triggers) — even though the INSERT policy itself
// allowed the write. For a guest order (`user_id` null), `auth.uid() =
// user_id` evaluates to NULL (not true), so that re-check silently fails
// and the whole insert gets rejected with a misleading "row violates
// row-level security policy" error. We already derive every value here
// ourselves (never trusting the client) and decide `user_id` from the
// verified session, so bypassing RLS for just this write is safe. The
// webhook route also uses this client, since it has no user session at
// all.
function adminClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export interface CheckoutItemInput {
  productId: string;
  quantity: number;
}

export interface CheckoutInput {
  customerName: string;
  customerEmail: string;
  shippingAddress: ShippingAddress;
  items: CheckoutItemInput[];
}

// Reads (checking who's logged in, looking up product prices) go through
// the normal per-request client so RLS applies as usual. The actual
// order/order_items writes go through the admin client — see
// adminClient() above for why.
async function createPendingOrder(input: CheckoutInput) {
  if (input.items.length === 0) {
    throw new Error("Your cart is empty.");
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Look up authoritative names/prices server-side instead of trusting
  // whatever the browser sent — the cart in localStorage could be stale
  // or tampered with.
  const productIds = input.items.map((item) => item.productId);
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, name, price")
    .in("id", productIds)
    .eq("is_active", true);

  if (productsError) throw new Error(productsError.message);

  const orderItems = input.items.map((item) => {
    const product = products?.find((p) => p.id === item.productId);
    if (!product) {
      throw new Error(
        "One of the items in your cart is no longer available."
      );
    }
    return {
      product_id: product.id,
      product_name: product.name,
      unit_price: product.price,
      quantity: item.quantity,
    };
  });

  const subtotal = orderItems.reduce(
    (total, item) => total + item.unit_price * item.quantity,
    0
  );
  const shipping = calculateShipping(subtotal);
  const total = subtotal + shipping;

  const db = adminClient();

  // Orders start `pending`. Stripe's webhook flips this to `paid` once
  // the customer actually completes payment on Stripe's hosted page —
  // we never trust the browser redirect back to us for that.
  const { data: order, error: orderError } = await db
    .from("orders")
    .insert({
      user_id: user?.id ?? null,
      customer_name: input.customerName,
      customer_email: input.customerEmail,
      shipping_address: input.shippingAddress,
      subtotal,
      total,
    })
    .select("id, created_at")
    .single();

  if (orderError) throw new Error(orderError.message);

  const { error: itemsError } = await db.from("order_items").insert(
    orderItems.map((item) => ({ ...item, order_id: order.id }))
  );

  if (itemsError) throw new Error(itemsError.message);

  return { order, orderItems, subtotal, shipping, total };
}

// Prefer an explicit site URL in production (works no matter what host
// header a proxy/load balancer forwards); fall back to the request's own
// host in development so this works out of the box on localhost.
async function getOrigin() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) return configured.replace(/\/$/, "");

  const hdrs = await headers();
  const host = hdrs.get("host");
  // `next dev` only ever serves plain HTTP, even when reached over the
  // LAN by IP (e.g. testing checkout from a phone) instead of localhost —
  // checking the hostname here guessed "https" for that case and sent
  // Stripe's redirect to an HTTPS URL nothing was listening on. Only
  // assume HTTPS once this is actually deployed.
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  return `${protocol}://${host}`;
}

// Creates the pending order in Supabase, then starts a Stripe Checkout
// Session for it and hands back the URL to redirect the customer to.
// Stripe hosts the actual payment page — card details never touch our
// server.
export async function createCheckoutSession(
  input: CheckoutInput
): Promise<{ url: string }> {
  const { order, orderItems, shipping } = await createPendingOrder(input);
  const origin = await getOrigin();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: input.customerEmail,
    line_items: [
      ...orderItems.map((item) => ({
        price_data: {
          currency: "usd" as const,
          product_data: { name: item.product_name },
          unit_amount: Math.round(item.unit_price * 100),
        },
        quantity: item.quantity,
      })),
      ...(shipping > 0
        ? [
            {
              price_data: {
                currency: "usd" as const,
                product_data: { name: "Shipping" },
                unit_amount: Math.round(shipping * 100),
              },
              quantity: 1,
            },
          ]
        : []),
    ],
    // Lets the webhook (and the success page) find this order again —
    // Stripe echoes metadata back on every event for the session.
    metadata: { orderId: order.id },
    success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    // Echoes the session id back too, so the checkout page can mark this
    // specific order cancelled right away instead of leaving it stuck on
    // `pending` until Stripe's `checkout.session.expired` event fires
    // (see expires_at below, for whoever just closes the tab instead of
    // clicking back).
    cancel_url: `${origin}/checkout?canceled=true&session_id={CHECKOUT_SESSION_ID}`,
    // Stripe's own default is 24h. 30 minutes — Stripe's own minimum for
    // this field — is plenty of time to actually pay, and means an
    // abandoned order doesn't sit `pending` for most of a day before the
    // webhook fallback cleans it up.
    expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
  });

  if (!session.url) {
    throw new Error("Could not start checkout. Please try again.");
  }

  const db = adminClient();
  const { error: sessionIdError } = await db
    .from("orders")
    .update({ stripe_session_id: session.id })
    .eq("id", order.id);

  // Not fatal — the order can still be paid and tracked via
  // stripe_payment_intent_id from the webhook — but worth knowing about
  // if it ever happens again instead of failing silently.
  if (sessionIdError) {
    console.error("Failed to save stripe_session_id:", sessionIdError.message);
  }

  return { url: session.url };
}
