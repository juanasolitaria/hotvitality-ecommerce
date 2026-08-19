"use server";

import { createClient as createServiceClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

import { createClient as createSessionClient } from "@/lib/supabase/server";
import { sendShippingConfirmationEmail } from "@/lib/email/shipping-confirmation";

// Same service-role pattern as admin/products/actions.ts: writes bypass
// Row Level Security so they don't depend on the caller's own RLS grants.
function adminClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// Unlike admin/products/actions.ts, this checks the caller is actually an
// admin before writing anything — same session + profiles.role check as
// admin/layout.tsx's page guard. Server Actions are reachable as their own
// endpoint regardless of which page rendered the button that called them,
// so the page-level gate alone isn't enough here.
async function requireAdmin() {
  const supabase = await createSessionClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not signed in");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") throw new Error("Not authorized");
}

// Inserts the tracking number PirateShip gave the admin and emails it to
// the customer. This intentionally does NOT touch `status` — it stays
// "paid", exactly as before. "Shipped" is read elsewhere purely from
// whether `tracking_number` is set (see getShippingStatus in
// order-status-badge.tsx), not from a status transition.
export async function setTrackingNumber(orderId: string, trackingNumber: string) {
  const trimmed = trackingNumber.trim();
  if (!trimmed) throw new Error("Tracking number is required");

  await requireAdmin();

  const db = adminClient();

  // .is("tracking_number", null) is the idempotency guard here (mirrors
  // the webhook's .eq("status", "pending") pattern): it only succeeds on
  // an order that doesn't have one yet, so re-submitting on an
  // already-shipped order is rejected instead of overwriting the tracking
  // number and re-sending the email.
  const { data: order, error } = await db
    .from("orders")
    .update({ tracking_number: trimmed })
    .eq("id", orderId)
    .is("tracking_number", null)
    .select("customer_name, customer_email, order_items(product_name, quantity)")
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!order) throw new Error("This order already has a tracking number");

  // The DB write above is what actually matters — if the email fails, the
  // tracking number is still saved correctly, we just surface the failure
  // to the admin instead of silently losing it.
  try {
    await sendShippingConfirmationEmail({
      orderId,
      customerName: order.customer_name,
      customerEmail: order.customer_email,
      trackingNumber: trimmed,
      items: order.order_items,
    });
  } catch {
    throw new Error("Order marked as shipped, but the shipping email failed to send.");
  }

  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
  revalidatePath("/admin/payments");
}
