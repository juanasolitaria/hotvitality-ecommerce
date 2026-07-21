import type { Order } from "@/lib/types";

// Mock orders/payments for the admin dashboard. Once Stripe + Supabase
// are wired up, this will come from real payment and order records.
export const orders: Order[] = [
  {
    id: "ORD-1001",
    customerName: "Maria Gonzalez",
    customerEmail: "maria.gonzalez@example.com",
    itemCount: 3,
    total: 100.96,
    status: "paid",
    date: "2026-07-18",
  },
  {
    id: "ORD-1002",
    customerName: "James Carter",
    customerEmail: "james.carter@example.com",
    itemCount: 1,
    total: 24.99,
    status: "shipped",
    date: "2026-07-17",
  },
  {
    id: "ORD-1003",
    customerName: "Aiko Tanaka",
    customerEmail: "aiko.tanaka@example.com",
    itemCount: 2,
    total: 46.74,
    status: "pending",
    date: "2026-07-17",
  },
  {
    id: "ORD-1004",
    customerName: "Lucas Silva",
    customerEmail: "lucas.silva@example.com",
    itemCount: 4,
    total: 132.47,
    status: "paid",
    date: "2026-07-16",
  },
  {
    id: "ORD-1005",
    customerName: "Priya Patel",
    customerEmail: "priya.patel@example.com",
    itemCount: 1,
    total: 34.5,
    status: "refunded",
    date: "2026-07-15",
  },
  {
    id: "ORD-1006",
    customerName: "Tom Becker",
    customerEmail: "tom.becker@example.com",
    itemCount: 2,
    total: 41.74,
    status: "shipped",
    date: "2026-07-14",
  },
  {
    id: "ORD-1007",
    customerName: "Sofia Rossi",
    customerEmail: "sofia.rossi@example.com",
    itemCount: 3,
    total: 78.48,
    status: "paid",
    date: "2026-07-12",
  },
];
