import { createClient } from "@/lib/supabase/server";
import type { Order, OrderStatus } from "@/lib/types";

// Shape of a row as it comes back from Supabase (snake_case, plus the
// nested `order_items` used only to compute a total item count).
interface OrderRow {
  id: string;
  customer_name: string;
  customer_email: string;
  status: OrderStatus;
  total: number;
  created_at: string;
  order_items: { quantity: number }[];
}

function mapOrder(row: OrderRow): Order {
  return {
    id: row.id,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    itemCount: row.order_items.reduce((sum, item) => sum + item.quantity, 0),
    total: row.total,
    status: row.status,
    date: row.created_at.slice(0, 10),
  };
}

// Admin-only: relies on the `orders_select_own_or_admin` RLS policy, which
// lets a request through when the logged-in user's profile has
// `role = 'admin'`. Both callers (dashboard, payments page) sit behind
// `admin/layout.tsx`'s own admin check, so by the time this runs we
// already know the session qualifies.
export async function getOrders(): Promise<Order[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, customer_name, customer_email, status, total, created_at, order_items(quantity)"
    )
    .order("created_at", { ascending: false })
    .returns<OrderRow[]>();

  if (error) throw error;
  return (data ?? []).map(mapOrder);
}
