import type { Metadata } from "next";

import { createClient } from "@/lib/supabase/server";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export const metadata: Metadata = {
  title: "Checkout | Hot Vitality",
};

export default async function CheckoutPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Prefill the form for logged-in customers; guests just get blank
  // fields. Either way `createOrder` accepts the checkout.
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

      <CheckoutForm initialName={initialName} initialEmail={user?.email ?? ""} />
    </div>
  );
}
