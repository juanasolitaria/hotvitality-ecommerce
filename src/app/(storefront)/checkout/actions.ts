"use server";

import { createClient as createServiceClient } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";
import { calculateShipping } from "@/lib/shipping";

// Postgres re-checks the `orders_select_own_or_admin` policy against a
// row's final values whenever an INSERT asks for it back via RETURNING
// (which `.select()` triggers) — even though the INSERT policy itself
// allowed the write. For a guest order (`user_id` null), `auth.uid() =
// user_id` evaluates to NULL (not true), so that re-check silently fails
// and the whole insert gets rejected with a misleading "row violates
// row-level security policy" error. We already derive every value here
// ourselves (never trusting the client) and decide `user_id` from the
// verified session, so bypassing RLS for just this write is safe.
function adminClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export interface ShippingAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
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

export interface OrderConfirmation {
  id: string;
  createdAt: string;
  items: { productName: string; unitPrice: number; quantity: number }[];
  subtotal: number;
  shipping: number;
  total: number;
}

// Reads (checking who's logged in, looking up product prices) go through
// the normal per-request client so RLS applies as usual. The actual
// order/order_items writes go through the admin client — see
// adminClient() above for why. No payment yet — orders are created
// straight into `pending` status; Stripe will move them to `paid` once
// it's wired up.
export async function createOrder(
  input: CheckoutInput
): Promise<OrderConfirmation> {
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

  return {
    id: order.id,
    createdAt: order.created_at,
    items: orderItems.map(({ product_name, unit_price, quantity }) => ({
      productName: product_name,
      unitPrice: unit_price,
      quantity,
    })),
    subtotal,
    shipping,
    total,
  };
}
