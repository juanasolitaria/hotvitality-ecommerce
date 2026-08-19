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

export type OrderStatus =
  | "pending"
  | "paid"
  | "awaiting_shipping_label"
  | "shipped"
  | "refunded"
  | "cancelled";

export interface ShippingAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  itemCount: number;
  total: number;
  status: OrderStatus;
  /** ISO date string, e.g. "2026-07-12". */
  date: string;
  /** Set once the admin inserts it on the order detail page. Whether an
   *  order has "shipped" is read from this being non-null, not from
   *  `status` — `status` stays "paid" even after a tracking number is
   *  added. Needed on the list view too, for the Shipping Status column. */
  trackingNumber: string | null;
}

// Everything Order has, plus what the payments list doesn't need but a
// single order's detail page does: the shipping address/phone and the
// actual line items, for packing and buying a shipping label.
export interface OrderDetail extends Order {
  shippingAddress: ShippingAddress | null;
  subtotal: number;
  items: {
    productName: string;
    unitPrice: number;
    quantity: number;
  }[];
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
