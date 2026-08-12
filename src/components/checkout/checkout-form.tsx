"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";

import { useCart } from "@/lib/cart-context";
import { calculateShipping } from "@/lib/shipping";
import { createCheckoutSession } from "@/app/(storefront)/checkout/actions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
// Input component, which every other page also uses) so the fields stand
// out against the page background: white background, black typed text,
// white placeholder text.
const FIELD_CLASS = "bg-white text-black placeholder:text-white";

// Loose but real phone validation — digits with optional +, spaces,
// dashes, and parens, long enough to be an actual phone number. Not full
// E.164 parsing, just enough to stop obviously-fake input like "asdf".
const PHONE_PATTERN = "^[+]?[0-9()\\-\\s]{7,20}$";

export function CheckoutForm({ initialName, initialEmail }: CheckoutFormProps) {
  const { items, subtotal } = useCart();

  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [address, setAddress] = useState(BLANK_ADDRESS);
  // Opt-in only, unchecked by default — SMS marketing needs the
  // customer's clear affirmative consent, unlike marketing email (see the
  // Privacy Policy's "Marketing communications" section).
  const [smsConsent, setSmsConsent] = useState(false);
  // Required — unlike SMS consent, checkout can't proceed without this
  // one, both here (before we even call the server) and again in
  // createCheckoutSession (never trust that the client actually enforced it).
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function updateAddress(field: keyof typeof BLANK_ADDRESS, value: string) {
    setAddress((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!termsAccepted) {
      toast.error("Please accept the Terms and Conditions to continue.");
      return;
    }

    setSubmitting(true);

    try {
      // Creates the pending order in Supabase, then starts a Stripe
      // Checkout Session and hands back its URL. We don't clear the cart
      // or show a confirmation here — the customer still has to actually
      // pay on Stripe's page first. That happens on /checkout/success,
      // which only renders once Stripe confirms the payment.
      const { url } = await createCheckoutSession({
        customerName: name,
        customerEmail: email,
        shippingAddress: address,
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
        smsMarketingConsent: smsConsent,
        termsAccepted,
      });

      window.location.href = url;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Couldn't start checkout."
      );
      setSubmitting(false);
    }
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
            pattern={PHONE_PATTERN}
            title="Enter a valid phone number (digits only, 7–20 characters)"
            value={address.phone}
            onChange={(e) => updateAddress("phone", e.target.value)}
          />
        </div>

        {/* Opt-in checkbox for SMS marketing, right under the phone field
            it applies to. Unchecked by default — see Privacy Policy for
            why this needs to be an explicit choice, not a default. */}
        <div className="flex items-start gap-2.5 rounded-lg border border-border bg-muted/50 p-3">
          <Checkbox
            id="smsConsent"
            checked={smsConsent}
            onCheckedChange={setSmsConsent}
            className="mt-0.5"
          />
          <Label htmlFor="smsConsent" className="text-sm font-normal text-foreground">
            Text me order updates and promotional offers from HotVitality.
            Msg &amp; data rates may apply, message frequency varies. Reply
            STOP to opt out at any time. See our{" "}
            <Link href="/privacy" className="text-primary underline">
              Privacy Policy
            </Link>
            .
          </Label>
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

          <div className="mt-4 flex items-start gap-2.5">
            <Checkbox
              id="termsAccepted"
              checked={termsAccepted}
              onCheckedChange={setTermsAccepted}
              className="mt-0.5"
            />
            <Label htmlFor="termsAccepted" className="text-sm font-normal text-foreground">
              I agree to the{" "}
              <Link href="/terms" className="text-primary underline">
                Terms and Conditions
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary underline">
                Privacy Policy
              </Link>
              .
            </Label>
          </div>

          {/* Creates a `pending` order in Supabase, then sends the
              customer to Stripe's hosted checkout page to actually pay.
              The order only flips to `paid` once Stripe's webhook
              confirms it. */}
          <Button
            type="submit"
            size="lg"
            disabled={submitting}
            className="mt-4 w-full"
          >
            {submitting ? "Redirecting to payment..." : "Continue to Payment"}
          </Button>
        </div>
      </div>
    </form>
  );
}
