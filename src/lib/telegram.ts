import type { ShippingAddress } from "@/lib/types";

interface AdminOrderNotificationInput {
  orderId: string;
  customerName: string;
  customerEmail: string;
  total: number;
  items: { product_name: string; unit_price: number; quantity: number }[];
  shippingAddress: ShippingAddress | null;
}

function formatAddress(address: ShippingAddress) {
  const line2 = address.line2 ? `, ${address.line2}` : "";
  return [
    `${address.line1}${line2}`,
    `${address.city}, ${address.state} ${address.postalCode}`,
    address.country,
    address.phone,
  ].join("\n");
}

// Fire-and-log, same reasoning as sendOrderConfirmationEmail: the order is
// already marked "paid" by the time this runs, which is what matters. A
// Telegram outage (or missing config) shouldn't turn into a Stripe webhook
// retry, so this only ever logs — never throws.
export async function sendAdminOrderNotification(order: AdminOrderNotificationInput) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error("Telegram not configured: missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID");
    return;
  }

  const itemLines = order.items
    .map(
      (item) =>
        `${item.quantity} x ${item.product_name} — $${(item.unit_price * item.quantity).toFixed(2)}`
    )
    .join("\n");

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const text = [
    `🛒 New order — $${order.total.toFixed(2)}`,
    "",
    `${order.customerName} (${order.customerEmail})`,
    "",
    itemLines,
    "",
    order.shippingAddress ? formatAddress(order.shippingAddress) : "No shipping address on file",
    "",
    `${siteUrl}/admin/orders/${order.orderId}`,
  ].join("\n");

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error(`Failed to send Telegram notification for order ${order.orderId}:`, body);
    }
  } catch (error) {
    console.error(`Failed to send Telegram notification for order ${order.orderId}:`, error);
  }
}
