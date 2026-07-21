import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";

import type { CartItem as CartItemType } from "@/lib/types";

interface CartItemProps {
  item: CartItemType;
  onIncrease: (productId: string) => void;
  onDecrease: (productId: string) => void;
  onRemove: (productId: string) => void;
}

export function CartItem({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemProps) {
  const { product, quantity } = item;
  const lineTotal = product.price * quantity;

  return (
    // Stacks the price/remove row under the product info on mobile;
    // lays everything out in one row from `sm` up.
    <div className="flex flex-col gap-4 border-b border-border py-4 sm:flex-row sm:items-center">
      <Link
        href={`/product/${product.slug}`}
        className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-muted"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="80px"
          className="object-cover"
        />
      </Link>

      <div className="min-w-0 flex-1">
        <Link
          href={`/product/${product.slug}`}
          className="text-sm font-semibold text-foreground hover:text-primary"
        >
          {product.name}
        </Link>
        <p className="mt-1 text-sm text-muted-foreground">
          ${product.price.toFixed(2)} each
        </p>
      </div>

      <div className="flex items-center justify-between gap-4 sm:justify-normal">
        <div className="flex items-center rounded-lg border border-input">
          <button
            type="button"
            onClick={() => onDecrease(product.id)}
            aria-label="Decrease quantity"
            className="flex size-8 items-center justify-center text-foreground hover:bg-accent disabled:opacity-40"
            disabled={quantity === 1}
          >
            <Minus className="size-3.5" />
          </button>
          <span className="w-7 text-center text-sm font-medium">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => onIncrease(product.id)}
            aria-label="Increase quantity"
            className="flex size-8 items-center justify-center text-foreground hover:bg-accent"
          >
            <Plus className="size-3.5" />
          </button>
        </div>

        <p className="w-16 text-right text-sm font-semibold text-foreground">
          ${lineTotal.toFixed(2)}
        </p>

        <button
          type="button"
          onClick={() => onRemove(product.id)}
          aria-label={`Remove ${product.name} from cart`}
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </div>
  );
}
