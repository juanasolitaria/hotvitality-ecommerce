import type { StoreUser } from "@/lib/types";

// Mock users for the admin dashboard. Once Supabase Auth is wired up,
// this will come from the real users table.
export const users: StoreUser[] = [
  {
    id: "1",
    name: "Juan Rodriguez",
    email: "juan@hotvitality.com",
    role: "admin",
    joinedDate: "2026-01-10",
    ordersCount: 0,
  },
  {
    id: "2",
    name: "Maria Gonzalez",
    email: "maria.gonzalez@example.com",
    role: "customer",
    joinedDate: "2026-03-22",
    ordersCount: 4,
  },
  {
    id: "3",
    name: "James Carter",
    email: "james.carter@example.com",
    role: "customer",
    joinedDate: "2026-04-02",
    ordersCount: 1,
  },
  {
    id: "4",
    name: "Aiko Tanaka",
    email: "aiko.tanaka@example.com",
    role: "customer",
    joinedDate: "2026-04-19",
    ordersCount: 2,
  },
  {
    id: "5",
    name: "Lucas Silva",
    email: "lucas.silva@example.com",
    role: "customer",
    joinedDate: "2026-05-08",
    ordersCount: 6,
  },
  {
    id: "6",
    name: "Priya Patel",
    email: "priya.patel@example.com",
    role: "customer",
    joinedDate: "2026-06-01",
    ordersCount: 1,
  },
];
