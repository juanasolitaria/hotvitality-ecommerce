"use server";

import { createClient as createServiceClient } from "@supabase/supabase-js";

import { checkIpRateLimit, getClientIp } from "@/lib/rate-limit";
import { sendContactMessageEmail } from "@/lib/email/contact-message";

// Same reasoning as checkout/actions.ts: no user session to check against
// for an anonymous visitor filling out this form.
function adminClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// Loose but real sanity check — not full RFC 5322 parsing, just enough to
// reject obviously-fake input.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface ContactMessageInput {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export async function sendContactMessage(input: ContactMessageInput) {
  const name = input.name.trim();
  const email = input.email.trim();
  const phone = input.phone.trim();
  const message = input.message.trim();

  if (!name || name.length > 100) {
    throw new Error("Please enter your name.");
  }
  if (!EMAIL_PATTERN.test(email)) {
    throw new Error("Please enter a valid email address.");
  }
  if (!message || message.length > 2000) {
    throw new Error("Please enter a message (up to 2000 characters).");
  }

  const db = adminClient();
  const clientIp = await getClientIp();

  // Nothing about this form requires being logged in, so without this a
  // script could call it in a loop to flood the business inbox.
  await checkIpRateLimit({
    db,
    table: "contact_rate_limits",
    clientIp,
    windowMinutes: 10,
    maxAttempts: 3,
    errorMessage: "Too many messages sent. Please try again in a few minutes.",
  });

  // Recorded before sending, so a failed email send can't be used to
  // retry past the limit — the attempt itself is what counts, not
  // whether Resend accepted it.
  const { error: insertError } = await db
    .from("contact_rate_limits")
    .insert({ client_ip: clientIp });

  if (insertError) {
    console.error("Failed to record contact rate-limit row:", insertError.message);
  }

  await sendContactMessageEmail({
    name,
    email,
    phone: phone || null,
    message,
  });
}
