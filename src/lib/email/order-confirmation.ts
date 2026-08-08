import { resend } from "@/lib/resend";

interface OrderConfirmationInput {
  orderId: string;
  customerName: string;
  customerEmail: string;
  subtotal: number;
  total: number;
  items: { product_name: string; unit_price: number; quantity: number }[];
}

// Same shell (header bar / white card / footer bar) as the Supabase
// password-reset email template, so the two emails read as one brand.
// Table-based layout with inline styles throughout — email clients don't
// support Tailwind, external stylesheets, or reliably even flexbox.
function buildHtml(order: OrderConfirmationInput) {
  const shipping = order.total - order.subtotal;

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
            <h1 style="margin:0 0 12px;color:#16241c;font-size:20px;">Thanks for your order, ${order.customerName}!</h1>
            <p style="margin:0 0 24px;color:#4b5563;font-size:14px;line-height:1.6;">
              We've received your payment and we're getting it ready. We'll email you again once it ships.
            </p>

            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
              ${rows}
              <tr>
                <td style="padding:8px 0;border-top:1px solid #e5e7eb;color:#4b5563;font-size:14px;">Subtotal</td>
                <td style="padding:8px 0;border-top:1px solid #e5e7eb;text-align:right;color:#4b5563;font-size:14px;">$${order.subtotal.toFixed(
                  2
                )}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#4b5563;font-size:14px;">Shipping</td>
                <td style="padding:8px 0;text-align:right;color:#4b5563;font-size:14px;">${
                  shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`
                }</td>
              </tr>
              <tr>
                <td style="padding:8px 0;border-top:1px solid #e5e7eb;font-weight:bold;color:#16241c;font-size:14px;">Total</td>
                <td style="padding:8px 0;border-top:1px solid #e5e7eb;text-align:right;font-weight:bold;color:#16241c;font-size:14px;">$${order.total.toFixed(
                  2
                )}</td>
              </tr>
            </table>
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

// Fire-and-log: the order is already marked "paid" in Supabase by the time
// this runs, which is the part that actually matters. If Resend is down or
// rejects the send, we log it and move on instead of throwing — a failed
// email shouldn't make the webhook return 500 and cause Stripe to retry the
// whole event.
export async function sendOrderConfirmationEmail(order: OrderConfirmationInput) {
  const { error } = await resend.emails.send({
    from: "HotVitality <no-reply@hot-vitality.com>",
    to: order.customerEmail,
    subject: "Your HotVitality order is confirmed",
    html: buildHtml(order),
  });

  if (error) {
    console.error(
      `Failed to send order confirmation email for order ${order.orderId}:`,
      error.message
    );
  }
}
