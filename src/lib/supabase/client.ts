import { createBrowserClient } from "@supabase/ssr";

// Supabase client for use in Client Components ("use client" files).
// Reads the two public env vars — safe to expose to the browser, that's
// what the anon key is designed for (RLS policies do the real access control).
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
