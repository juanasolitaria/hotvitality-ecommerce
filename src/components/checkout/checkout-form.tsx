"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { CheckCircle2, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

import { useCart } from "@/lib/cart-context";
import { calculateShipping } from "@/lib/shipping";
import { createOrder, type OrderConfirmation } from "@/app/(storefront)/checkout/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface CheckoutFormProps {
  initialName: string;
  initialEmail: string;
}

// Blank shipping-address shape, spread into state so each field has its
// own controlled input below.
const BLANK_ADDRESS = {
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
  phone: "",
};

// Scoped to just this form's inputs (instead of editing the shared
// Input component, which every other page also uses) so typed text is
// black and placeholder text is white, overriding the theme's default
// muted-gray placeholder for this page only.
const FIELD_CLASS = "text-black placeholder:text-white";

export function CheckoutForm({ initialName, initialEmail }: CheckoutFormProps) {
  const { items, subtotal, clearCart } = useCart();

  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [address, setAddress] = useState(BLANK_ADDRESS);
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<OrderConfirmation | null>(
    null
  );

  function updateAddress(field: keyof typeof BLANK_ADDRESS, value: string) {
    setAddress((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const result = await createOrder({
        customerName: name,
        customerEmail: email,
        shippingAddress: address,
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      });

      clearCart();
      setConfirmation(result);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Couldn't place your order."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmation) {
    return (
      <div className="mx-auto mt-10 max-w-lg text-center">
        <CheckCircle2 className="mx-auto size-12 text-primary" />
        <h2 className="mt-4 text-xl font-semibold text-foreground">
          Order placed!
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Order <span className="font-medium text-foreground">{confirmation.id}</span> —
          we&apos;ll email you at {email} once it ships.
        </p>

        <div className="mt-6 rounded-2xl border border-border bg-card p-6 text-left">
          {confirmation.items.map((item, i) => (
            <div key={i} className="flex justify-between py-1 text-sm">
              <span className="text-muted-foreground">
                {item.quantity} &times; {item.productName}
              </span>
              <span className="text-foreground">
                ${(item.unitPrice * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
          <Separator className="my-3" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Subtotal</span>
            <span>${confirmation.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Shipping</span>
            <span>
              {confirmation.shipping === 0
                ? "Free"
                : `$${confirmation.shipping.toFixed(2)}`}
            </span>
          </div>
          <Separator className="my-3" />
          <div className="flex justify-between text-base font-semibold text-foreground">
            <span>Total</span>
            <span>${confirmation.total.toFixed(2)}</span>
          </div>
        </div>

        <Button
          className="mt-6 w-full"
          nativeButton={false}
          render={<Link href="/shop" />}
        >
          Continue Shopping
        </Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center py-20 text-center">
        <ShoppingBag className="size-12 text-muted-foreground" />
        <h2 className="mt-4 text-xl font-semibold text-foreground">
          Your cart is empty
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Add something to your cart before checking out.
        </p>
        <Button
          className="mt-6"
          nativeButton={false}
          render={<Link href="/shop" />}
        >
          Continue Shopping
        </Button>
      </div>
    );
  }

  const shipping = calculateShipping(subtotal);
  const total = subtotal + shipping;

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3"
    >
      {/* Shipping details — stacks full-width on mobile, takes the left
          two columns from `lg` up. */}
      <div className="flex flex-col gap-4 lg:col-span-2">
        <h2 className="text-lg font-semibold text-foreground">
          Contact &amp; shipping
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              className={FIELD_CLASS}
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              className={FIELD_CLASS}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            className={FIELD_CLASS}
            required
            value={address.phone}
            onChange={(e) => updateAddress("phone", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="line1">Address</Label>
          <Input
            id="line1"
            className={FIELD_CLASS}
            required
            value={address.line1}
            onChange={(e) => updateAddress("line1", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="line2">Apartment, suite, etc. (optional)</Label>
          <Input
            id="line2"
            className={FIELD_CLASS}
            value={address.line2}
            onChange={(e) => updateAddress("line2", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              className={FIELD_CLASS}
              required
              value={address.city}
              onChange={(e) => updateAddress("city", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="state">State / Province</Label>
            <Input
              id="state"
              className={FIELD_CLASS}
              required
              value={address.state}
              onChange={(e) => updateAddress("state", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="postalCode">Postal code</Label>
            <Input
              id="postalCode"
              className={FIELD_CLASS}
              required
              value={address.postalCode}
              onChange={(e) => updateAddress("postalCode", e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            className={FIELD_CLASS}
            required
            value={address.country}
            onChange={(e) => updateAddress("country", e.target.value)}
          />
        </div>
      </div>

      {/* Order summary — sticky sidebar from `lg` up, same treatment as
          the cart page's summary. */}
      <div className="lg:sticky lg:top-20 lg:h-fit">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">
            Order Summary
          </h2>

          <div className="mt-4 flex flex-col gap-2">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="flex justify-between text-sm"
              >
                <span className="text-muted-foreground">
                  {item.quantity} &times; {item.product.name}
                </span>
                <span className="text-foreground">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="flex justify-between text-base font-semibold text-foreground">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          {/* No payment step yet — this creates a `pending` order straight
              in Supabase so we can confirm the checkout flow end to end
              before Stripe is wired up. */}
          <Button
            type="submit"
            size="lg"
            disabled={submitting}
            className="mt-6 w-full"
          >
            {submitting ? "Placing order..." : "Place Order"}
          </Button>
        </div>
      </div>
    </form>
  );
}
