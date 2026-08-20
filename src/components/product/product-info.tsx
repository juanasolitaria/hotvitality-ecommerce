"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  Lock,
  Minus,
  Package,
  Plus,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { toast } from "sonner";

import type { Product } from "@/lib/types";
import { useCart } from "@/lib/cart-context";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PaymentBadges } from "@/components/product/payment-badges";

// The admin's description field is plain text, not real rich text — the
// only formatting it supports is wrapping a phrase in `**like this**`
// (via the Bold button in the admin form), which this turns into <strong>
// when displaying the description here.
function renderWithBold(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

// Groups consecutive `- ` lines (from the admin's bullet-list button)
// into a real <ul>, and renders everything else as plain paragraphs —
// both with `**bold**` support via renderWithBold.
function renderDescription(text: string) {
  const lines = text.split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    if (lines[i].startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].slice(2));
        i++;
      }
      blocks.push(
        <ul key={key++} className="list-disc space-y-1 pl-5">
          {items.map((item, itemIndex) => (
            <li key={itemIndex}>{renderWithBold(item)}</li>
          ))}
        </ul>
      );
    } else {
      const paragraphLines: string[] = [];
      while (i < lines.length && !lines[i].startsWith("- ")) {
        paragraphLines.push(lines[i]);
        i++;
      }
      blocks.push(
        <p key={key++} className="whitespace-pre-wrap">
          {renderWithBold(paragraphLines.join("\n"))}
        </p>
      );
    }
  }

  return blocks;
}

export function ProductInfo({ product }: { product: Product }) {
  const { addItem, buyNow } = useCart();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [descriptionOpen, setDescriptionOpen] = useState(false);

  function decrease() {
    setQuantity((prev) => Math.max(1, prev - 1));
  }

  function increase() {
    setQuantity((prev) => prev + 1);
  }

  function handleAddToCart() {
    addItem(product, quantity);
    toast.success(`${quantity} x ${product.name} added to cart`);
  }

  function handleBuyNow() {
    // Replaces the cart with just this item and jumps straight to
    // checkout — reuses the same shipping/payment flow as a normal
    // checkout instead of duplicating it.
    buyNow(product, quantity);
    router.push("/checkout");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
        {product.name}
      </h1>
      <p className="mt-2 text-xl font-semibold text-primary">
        ${product.price.toFixed(2)}
      </p>

      {/* Quantity stepper + Add to Cart stack on mobile, sit side by side
          from `sm` up. */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* overflow-hidden clips each button's hover/active background to
            the container's rounded corners — without it, the square
            highlight on the decrease button broke out past the left
            corner and the increase button's broke out past the right
            one, making the two look inconsistent. */}
        <div className="flex w-fit items-center overflow-hidden rounded-lg border border-input !bg-white shadow-sm">
          <button
            type="button"
            onClick={decrease}
            aria-label="Decrease quantity"
            className="flex size-9 items-center justify-center text-foreground hover:bg-accent disabled:opacity-40"
            disabled={quantity === 1}
          >
            <Minus className="size-4" />
          </button>
          <span className="w-8 text-center text-sm font-medium">
            {quantity}
          </span>
          <button
            type="button"
            onClick={increase}
            aria-label="Increase quantity"
            className="flex size-9 items-center justify-center text-foreground hover:bg-accent"
          >
            <Plus className="size-4" />
          </button>
        </div>

        <Button
          size="lg"
          onClick={handleAddToCart}
          className="bg-[#FFD814] text-black hover:bg-[#F7CA00] sm:flex-1"
        >
          Add to Cart
        </Button>
      </div>

      {/* Skips the cart entirely — replaces it with just this item and
          goes straight to /checkout. Amazon-style yellow/orange pairing:
          Add to Cart is the lighter, default action; Buy Now is the
          bolder one that jumps straight to payment. */}
      <Button
        size="lg"
        onClick={handleBuyNow}
        className="mt-3 w-full bg-[#FFA41C] text-black hover:bg-[#FA8900]"
      >
        Buy Now
      </Button>

      <div className="mt-6">
        <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          <Lock className="size-3.5" />
          Guaranteed Safe Checkout
        </p>
        <div className="mt-2">
          <PaymentBadges />
        </div>
      </div>

      <ul className="mt-5 flex flex-col gap-3 text-sm text-foreground">
        <li className="flex items-center gap-2.5">
          <Truck className="size-4 shrink-0 text-primary" />
          Estimated delivery time 3-5 days
        </li>
        <li className="flex items-center gap-2.5">
          <Package className="size-4 shrink-0 text-primary" />
          Free Shipping
        </li>
        <li className="flex items-center gap-2.5">
          <ShieldCheck className="size-4 shrink-0 text-primary" />
          14-day returns
        </li>
      </ul>


      <div className="mt-6">
        <button
          type="button"
          onClick={() => setDescriptionOpen((open) => !open)}
          aria-expanded={descriptionOpen}
          className="flex w-full items-center justify-between rounded-lg border border-border bg-card px-4 py-3 text-left text-base font-semibold text-foreground"
        >
          Description
          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-muted-foreground transition-transform duration-300",
              descriptionOpen && "rotate-180"
            )}
          />
        </button>

        {/* Animating to/from `height: auto` isn't directly possible in
            CSS, so this animates the grid row's fr unit instead (0fr to
            1fr) — a standard trick that gets a smooth height transition
            without measuring the content in JS. */}
        <div
          className={cn(
            "grid transition-[grid-template-rows] duration-300 ease-in-out",
            descriptionOpen ? "grid-rows-[1fr] mt-2" : "grid-rows-[0fr]"
          )}
        >
          <div className="overflow-hidden">
            <div className="flex flex-col gap-2 rounded-lg bg-white p-4 text-sm leading-relaxed text-foreground">
              {renderDescription(product.description)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
