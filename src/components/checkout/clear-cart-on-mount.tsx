"use client";

import { useEffect } from "react";

import { useCart } from "@/lib/cart-context";

// The success page is a Server Component (it needs to talk to Stripe +
// Supabase with server-only secrets), but the cart lives in client-side
// state/localStorage. This tiny client component is just the bridge:
// empty the cart once, right after the paid confirmation renders.
export function ClearCartOnMount() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
