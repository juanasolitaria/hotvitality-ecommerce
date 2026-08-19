import { resend } from "@/lib/resend";
import { detectCarrier, getCarrierTrackingUrl } from "@/lib/shipping-carrier";

interface ShippingConfirmationInput {
  orderId: string;
  customerName: string;
  customerEmail: string;
  trackingNumber: string;
  items: { product_name: string; quantity: number }[];
}

// Same shell (header bar / white card / footer bar) as
// order-confirmation.ts, so the two emails read as one brand.
function buildHtml(order: ShippingConfirmationInput) {
  const carrier = detectCarrier(order.trackingNumber);
  const trackingUrl = carrier ? getCarrierTrackingUrl(carrier, order.trackingNumber) : null;

  const itemRows = order.items
    .map(
      (item) => `
        <tr>
          <td style="padding:4px 0;color:#4b5563;font-size:14px;">${item.quantity} &times; ${item.product_name}</td>
        </tr>`
    )
    .join("");

  // Email clients strip JavaScript entirely, so a "copy to clipboard"
  // button can't actually work here — a plain link to the carrier's own
  // tracking page is the equivalent that does work everywhere. Styled as
  // a subtle outline button (not a solid fill) and left-aligned per the
  // rest of the email's text, rather than centered.
  const trackButton = trackingUrl
    ? `
        <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:20px;">
          <tr>
            <td>
              <a href="${trackingUrl}" style="display:inline-block;background-color:transparent;color:#1f4b36;padding:10px 20px;border:1px solid #1f4b36;border-radius:8px;font-size:14px;font-weight:bold;text-decoration:none;">
                Track your package
              </a>
            </td>
          </tr>
        </table>`
    : "";

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
            <h1 style="margin:0 0 12px;color:#16241c;font-size:20px;">Your order is on its way, ${order.customerName}!</h1>
            <p style="margin:0 0 24px;color:#4b5563;font-size:14px;line-height:1.6;">
              Your HotVitality order has shipped${carrier ? ` via ${carrier}` : ""}. Here's your tracking number:
            </p>

            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#faf3e7;border-radius:8px;">
              <tr>
                <td style="padding:16px;font-family:'Courier New', Courier, monospace;font-size:16px;font-weight:bold;color:#16241c;letter-spacing:0.05em;">
                  ${order.trackingNumber}
                </td>
              </tr>
            </table>
            ${trackButton}

            <p style="margin:24px 0 8px;color:#16241c;font-size:14px;font-weight:bold;">Your Order</p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
              ${itemRows}
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

// Unlike sendOrderConfirmationEmail (fire-and-log, since that one runs
// inside a Stripe webhook that must not turn a Resend failure into a
// retry loop), this runs from an admin-clicked Server Action — the admin
// should actually see it if the email fails to send, so this throws
// instead of swallowing the error.
export async function sendShippingConfirmationEmail(order: ShippingConfirmationInput) {
  const { error } = await resend.emails.send({
    from: "HotVitality <no-reply@hot-vitality.com>",
    to: order.customerEmail,
    subject: "Your HotVitality order has shipped",
    html: buildHtml(order),
  });

  if (error) {
    throw new Error(error.message);
  }
}
