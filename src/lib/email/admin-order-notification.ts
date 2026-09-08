import { resend } from "@/lib/resend";
import type { ShippingAddress } from "@/lib/types";

interface AdminOrderNotificationInput {
  orderId: string;
  customerName: string;
  customerEmail: string;
  total: number;
  items: { product_name: string; unit_price: number; quantity: number }[];
  shippingAddress: ShippingAddress | null;
}

// Same address the contact form already sends to.
const ADMIN_NOTIFICATION_EMAIL = "hotvitality@gmail.com";

function formatAddress(address: ShippingAddress) {
  const line2 = address.line2 ? `, ${address.line2}` : "";
  return `${address.line1}${line2}, ${address.city}, ${address.state} ${address.postalCode}, ${address.country} — ${address.phone}`;
}

// Same shell as order-confirmation.ts, so anything landing in the admin
// inbox still reads as a HotVitality email. Deliberately simpler content
// than the customer-facing template — this is a heads-up, not a receipt.
function buildHtml(order: AdminOrderNotificationInput) {
  const rows = order.items
    .map(
      (item) => `
        <tr>
          <td style="padding: 8px 0; color: #4b5563; font-size: 14px;">${item.quantity} &times; ${item.product_name}</td>
          <td style="padding: 8px 0; text-align: right; color: #4b5563; font-size: 14px;">$${(
            item.unit_price * item.quantity
          ).toFixed(2)}</td>
        </tr>`
    )
    .join("");

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const orderUrl = `${siteUrl}/admin/orders/${order.orderId}`;

  return `
    <div style="background-color:#e1ebe2;padding:32px 16px;font-family:Arial, Helvetica, sans-serif;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;margin:0 auto;background-color:#ffffff;border-radius:12px;overflow:hidden;">
        <tr>
          <td style="background-color:#1f4b36;padding:24px 32px;text-align:center;">
            <span style="color:#ffffff;font-size:20px;font-weight:bold;">HotVitality</span>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;">
            <h1 style="margin:0 0 12px;color:#16241c;font-size:20px;">New order — $${order.total.toFixed(2)}</h1>
            <p style="margin:0 0 24px;color:#4b5563;font-size:14px;line-height:1.6;">
              ${order.customerName} (${order.customerEmail})
            </p>

            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
              ${rows}
              <tr>
                <td style="padding:8px 0;border-top:1px solid #e5e7eb;font-weight:bold;color:#16241c;font-size:14px;">Total</td>
                <td style="padding:8px 0;border-top:1px solid #e5e7eb;text-align:right;font-weight:bold;color:#16241c;font-size:14px;">$${order.total.toFixed(
                  2
                )}</td>
              </tr>
            </table>

            <p style="margin:24px 0 0;color:#4b5563;font-size:13px;line-height:1.6;">
              ${
                order.shippingAddress
                  ? formatAddress(order.shippingAddress)
                  : "No shipping address on file"
              }
            </p>

            <a href="${orderUrl}" style="display:inline-block;margin-top:20px;color:#1f4b36;font-size:14px;font-weight:bold;text-decoration:underline;">
              View order in admin
            </a>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 32px;background-color:#faf3e7;text-align:center;">
            <span style="color:#6b7280;font-size:12px;">&copy; HotVitality</span>
          </td>
        </tr>
      </table>
    </div>
  `;
}

// Fire-and-log, same reasoning as sendOrderConfirmationEmail and
// sendAdminOrderNotification (Telegram): the order is already paid by the
// time this runs, which is what matters — a Resend outage here shouldn't
// turn into a Stripe webhook retry.
export async function sendAdminOrderEmail(order: AdminOrderNotificationInput) {
  const { error } = await resend.emails.send({
    from: "HotVitality <no-reply@hot-vitality.com>",
    to: ADMIN_NOTIFICATION_EMAIL,
    subject: `New order — $${order.total.toFixed(2)}`,
    html: buildHtml(order),
  });

  if (error) {
    console.error(
      `Failed to send admin order notification email for order ${order.orderId}:`,
      error.message
    );
  }
}
