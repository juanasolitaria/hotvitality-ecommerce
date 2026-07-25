// Shared TypeScript types for the store. Keeping them in one place makes
// it easy to see the shape of our data and reuse it across components.


export interface Product {
  id: string;
  /** URL-friendly identifier used in the /product/[slug] route. */
  slug: string;
  name: string;
  /** Short one-line description shown on product cards. */
  shortDescription: string;
  /** Longer description shown on the product detail page. */
  description: string;
  price: number;
  /** One or more photo URLs. The first one is used as the card/cart thumbnail. */
  images: string[];
}

// A single line item inside the shopping cart: a product plus how many
// of it the customer wants to buy.
export interface CartItem {
  product: Product;
  quantity: number;
}

// --- Admin dashboard types ---
// Both describe real rows from Supabase now — see
// src/lib/supabase/orders.ts and src/lib/supabase/users.ts.

export type OrderStatus = "pending" | "paid" | "shipped" | "refunded";

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  itemCount: number;
  total: number;
  status: OrderStatus;
  /** ISO date string, e.g. "2026-07-12". */
  date: string;
}

export type UserRole = "customer" | "admin";

export interface StoreUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  /** ISO date string. */
  joinedDate: string;
  ordersCount: number;
}
