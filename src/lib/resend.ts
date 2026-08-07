import { Resend } from "resend";

// Server-only Resend client — RESEND_API_KEY must never reach the browser.
// Same pattern as src/lib/stripe.ts.
export const resend = new Resend(process.env.RESEND_API_KEY!);
