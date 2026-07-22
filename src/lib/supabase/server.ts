import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

// Supabase client for use in Server Components, Server Actions, and Route
// Handlers. It reads/writes the session via cookies so the server always
// knows whether a request is logged in.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // `setAll` gets called from a Server Component sometimes, where
            // cookies can't be written. Safe to ignore as long as there's
            // middleware refreshing the session (see middleware.ts).
          }
        },
      },
    }
  );
}
