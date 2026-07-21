import type { CartItem } from "@/lib/types";
import { products } from "@/data/products";

// Mock cart contents used to demo the Cart page and the header's cart
// count badge during this UI-only phase. Once Supabase/Stripe are wired
// up, this will be replaced by a real cart stored per-user or in a cookie.
export const mockCartItems: CartItem[] = [
  { product: products[0], quantity: 1 },
  { product: products[3], quantity: 2 },
  { product: products[5], quantity: 1 },
];

export function getCartItemCount(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.quantity, 0);
}

export function getCartSubtotal(items: CartItem[]): number {
  return items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
}
