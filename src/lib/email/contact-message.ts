import { resend } from "@/lib/resend";

interface ContactMessageInput {
  name: string;
  email: string;
  phone: string | null;
  message: string;
}

// This message comes straight from an anonymous public form, and lands as
// HTML in the admin's inbox — unlike every other email template, none of
// this input is something we generated ourselves, so it has to be escaped
// before going into the HTML (otherwise a submitted message containing
// e.g. `<img src=x onerror=...>` would render as-is in the admin's email
// client instead of as plain text).
function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Same shell (header bar / white card / footer bar) as the other
// templates, but this one lands in the business inbox, not a customer's.
function buildHtml(input: ContactMessageInput) {
  const name = escapeHtml(input.name);
  const email = escapeHtml(input.email);
  const phone = input.phone ? escapeHtml(input.phone) : null;
  const message = escapeHtml(input.message);

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
            <h1 style="margin:0 0 16px;color:#16241c;font-size:20px;">New contact form message</h1>
            <p style="margin:0 0 4px;color:#4b5563;font-size:14px;"><strong style="color:#16241c;">Name:</strong> ${name}</p>
            <p style="margin:0 0 4px;color:#4b5563;font-size:14px;"><strong style="color:#16241c;">Email:</strong> ${email}</p>
            ${
              phone
                ? `<p style="margin:0 0 4px;color:#4b5563;font-size:14px;"><strong style="color:#16241c;">Phone:</strong> ${phone}</p>`
                : ""
            }
            <p style="margin:20px 0 8px;color:#16241c;font-size:14px;font-weight:bold;">Message</p>
            <p style="margin:0;padding:16px;background-color:#faf3e7;border-radius:8px;color:#16241c;font-size:14px;line-height:1.6;white-space:pre-wrap;">${message}</p>
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

// Throws (rather than fire-and-log) since this runs from a customer's
// direct form submission, not a webhook — they need to know if it failed
// so they can try another channel instead of assuming we got it.
export async function sendContactMessageEmail(input: ContactMessageInput) {
  const { error } = await resend.emails.send({
    from: "HotVitality <no-reply@hot-vitality.com>",
    to: "hotvitality@gmail.com",
    // Lets the admin just hit "reply" in their email client to answer the
    // customer directly, instead of copying their address out by hand.
    replyTo: input.email,
    subject: `New message from ${input.name}`,
    html: buildHtml(input),
  });

  if (error) {
    throw new Error(error.message);
  }
}
