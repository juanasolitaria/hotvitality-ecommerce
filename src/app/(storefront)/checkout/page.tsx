import type { Metadata } from "next";

import { createClient } from "@/lib/supabase/server";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export const metadata: Metadata = {
  title: "Checkout | Hot Vitality",
};

interface CheckoutPageProps {
  searchParams: Promise<{ canceled?: string }>;
}

export default async function CheckoutPage({
  searchParams,
}: CheckoutPageProps) {
  const { canceled } = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Prefill the form for logged-in customers; guests just get blank
  // fields. Either way `createCheckoutSession` accepts the checkout.
  let initialName = "";
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();
    initialName = profile?.full_name ?? "";
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
        Checkout
      </h1>

      {canceled === "true" && (
        <p className="mt-4 rounded-lg border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
          Payment was canceled — your order wasn&apos;t charged. You can pick
          up where you left off below.
        </p>
      )}

      <CheckoutForm initialName={initialName} initialEmail={user?.email ?? ""} />
    </div>
  );
}
