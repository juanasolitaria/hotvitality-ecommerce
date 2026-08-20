import { headers } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";

// Vercel (and most proxies) set this to a comma-separated list, closest
// client first. Falls back to null in local dev, where there's no proxy
// setting it at all.
export async function getClientIp(): Promise<string | null> {
  const hdrs = await headers();
  const forwardedFor = hdrs.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return hdrs.get("x-real-ip");
}

// Best-effort per-IP rate limiting shared by any Server Action that
// accepts anonymous public input (checkout, the contact form) — counts
// rows in `table` with a matching `client_ip` created within
// `windowMinutes`, and throws once `maxAttempts` is reached. A determined
// attacker can just rotate IPs, so this raises the bar against casual
// scripted abuse rather than acting as real bot protection.
export async function checkIpRateLimit({
  db,
  table,
  clientIp,
  windowMinutes,
  maxAttempts,
  errorMessage,
}: {
  db: SupabaseClient;
  table: string;
  clientIp: string | null;
  windowMinutes: number;
  maxAttempts: number;
  errorMessage: string;
}) {
  if (!clientIp) return;

  const since = new Date(Date.now() - windowMinutes * 60 * 1000).toISOString();
  const { count, error } = await db
    .from(table)
    .select("id", { count: "exact", head: true })
    .eq("client_ip", clientIp)
    .gte("created_at", since);

  if (error) {
    console.error(`Rate limit check failed for ${table}, allowing request:`, error.message);
    return;
  }

  if ((count ?? 0) >= maxAttempts) {
    throw new Error(errorMessage);
  }
}
