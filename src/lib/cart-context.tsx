"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";

import type { CartItem, Product } from "@/lib/types";

const STORAGE_KEY = "hotvitality_cart";

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (product: Product, quantity?: number) => void;
  /** Replaces the whole cart with just this product — used by "Buy Now". */
  buyNow: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

// The cart lives entirely in the browser (localStorage) — no login and no
// database table required. It survives page refreshes and closing the
// tab, but not switching devices or clearing browser data.
export function CartProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // localStorage only exists in the browser, so the initial load has to
  // happen after mount rather than during render.
  //
  // /checkout/success is a special case: it's an async Server Component
  // (it has to await Stripe + Supabase before it can render), so Next.js
  // streams it in as a separate, later commit than this layout's shell —
  // meaning THIS hydrate effect can run and restore the old cart from
  // localStorage before ClearCartOnMount (nested inside that slower page)
  // ever gets a chance to mount and call clearCart(). Rather than depend on
  // effect-ordering between two different components, just skip restoring
  // anything here when we already know the answer is "empty" — same
  // pathname check next/navigation gives every client and server render.
  useEffect(() => {
    if (pathname === "/checkout/success") {
      localStorage.removeItem(STORAGE_KEY);
      setHydrated(true);
      return;
    }

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch {
        // Ignore corrupted/old-shape data instead of crashing the app.
      }
    }
    setHydrated(true);
    // Only ever meant to run once, for whichever page this browser tab
    // first loaded — not on every client-side navigation afterward.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Skip the very first run (before the saved cart has loaded) so we
  // don't immediately overwrite it with an empty array.
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, hydrated]);

  function addItem(product: Product, quantity = 1) {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  }

  function buyNow(product: Product, quantity = 1) {
    setItems([{ product, quantity }]);
  }

  function removeItem(productId: string) {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  }

  function updateQuantity(productId: string, quantity: number) {
    if (quantity < 1) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }

  function clearCart() {
    setItems([]);
    // Also clear storage directly, not just state: on a fresh full-page
    // load (e.g. redirected back from Stripe), this component's mount
    // effect can run before the provider's own hydrate-from-localStorage
    // effect above (React fires child effects before parent effects), so
    // that hydration would otherwise immediately reload the old cart and
    // silently undo this clear.
    localStorage.removeItem(STORAGE_KEY);
  }

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        addItem,
        buyNow,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
