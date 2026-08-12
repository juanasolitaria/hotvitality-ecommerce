// Shared shipping rule so the cart summary (estimate) and the checkout
// server action (authoritative total) never drift apart. Shipping is
// always free — no threshold, no flat rate.
export function calculateShipping(): number {
  return 0;
}
