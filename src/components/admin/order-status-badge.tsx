import type { OrderStatus } from "@/lib/types";

// Maps each order status to a small set of Tailwind classes for the
// Badge component, so every table that shows order status looks the
// same (dashboard preview, payments table, etc).
export const ORDER_STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  paid: "border-green-200 bg-green-50 text-green-700",
  awaiting_shipping_label: "border-sky-200 bg-sky-50 text-sky-700",
  shipped: "border-blue-200 bg-blue-50 text-blue-700",
  refunded: "border-red-200 bg-red-50 text-red-700",
  cancelled: "border-rose-200 bg-rose-50 text-rose-700",
};

// The raw status values are snake_case (needed for the DB check
// constraint), but that's not something to show an admin directly —
// this is the human-readable text every Badge should render instead.
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  paid: "Paid",
  awaiting_shipping_label: "Awaiting label",
  shipped: "Shipped",
  refunded: "Refunded",
  cancelled: "Cancelled",
};

// A second, fulfillment-focused reading of the same order: what does the
// admin still need to *do* about shipping it? Deliberately not keyed off
// `status` alone — "shipped" is read from whether a tracking number has
// been set, not from `status` (which stays "paid" even after shipping).
// A `null` style means "not applicable" (pending/refunded/cancelled
// orders), rendered as plain muted text instead of a Badge.
export function getShippingStatus(
  status: OrderStatus,
  trackingNumber: string | null
): { label: string; style: string | null } {
  if (trackingNumber) {
    return { label: "Shipped", style: "border-blue-200 bg-blue-50 text-blue-700" };
  }
  if (status === "paid" || status === "awaiting_shipping_label") {
    return { label: "Awaiting label", style: "border-sky-200 bg-sky-50 text-sky-700" };
  }
  return { label: "—", style: null };
}
