import { createClient as createServiceClient } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";
import type { StoreUser } from "@/lib/types";

// Emails live in `auth.users`, which isn't reachable through the normal
// RLS-governed client — only the Admin API (service role key) can list
// them. Same "adminClient" pattern as admin/products/actions.ts.
function adminClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

interface ProfileRow {
  id: string;
  full_name: string | null;
  role: "customer" | "admin";
  created_at: string;
}

// Admin-only: relies on the `profiles_admin_all` / `orders_select_own_or_admin`
// RLS policies, same as getOrders() — the caller already passed the
// admin gate in admin/layout.tsx by the time this runs.
export async function getUsers(): Promise<StoreUser[]> {
  const supabase = await createClient();

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, full_name, role, created_at")
    .order("created_at", { ascending: true })
    .returns<ProfileRow[]>();

  if (profilesError) throw profilesError;
  if (!profiles || profiles.length === 0) return [];

  const { data: authUsers, error: authError } = await adminClient().auth.admin.listUsers({
    perPage: 1000,
  });
  if (authError) throw authError;

  const emailById = new Map(authUsers.users.map((u) => [u.id, u.email ?? ""]));

  // No group-by over PostgREST, so pull each order's user_id and count
  // them in JS — fine at this project's scale.
  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("user_id")
    .not("user_id", "is", null);
  if (ordersError) throw ordersError;

  const orderCountById = new Map<string, number>();
  for (const order of orders ?? []) {
    if (!order.user_id) continue;
    orderCountById.set(order.user_id, (orderCountById.get(order.user_id) ?? 0) + 1);
  }

  return profiles.map((profile) => ({
    id: profile.id,
    name: profile.full_name || "—",
    email: emailById.get(profile.id) ?? "",
    role: profile.role,
    joinedDate: profile.created_at.slice(0, 10),
    ordersCount: orderCountById.get(profile.id) ?? 0,
  }));
}
