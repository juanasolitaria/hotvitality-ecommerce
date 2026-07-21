import type { OrderStatus } from "@/lib/types";

// Maps each order status to a small set of Tailwind classes for the
// Badge component, so every table that shows order status looks the
// same (dashboard preview, payments table, etc).
export const ORDER_STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  paid: "border-green-200 bg-green-50 text-green-700",
  shipped: "border-blue-200 bg-blue-50 text-blue-700",
  refunded: "border-red-200 bg-red-50 text-red-700",
};
