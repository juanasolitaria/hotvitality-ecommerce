// Shared shipping rule so the cart summary (estimate) and the checkout
// server action (authoritative total) never drift apart.
export const FREE_SHIPPING_THRESHOLD = 50;
export const FLAT_SHIPPING_RATE = 5.99;

export function calculateShipping(subtotal: number): number {
  return subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD
    ? 0
    : FLAT_SHIPPING_RATE;
}
