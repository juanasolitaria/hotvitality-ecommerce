import type { Metadata } from "next";
import { Mail, Phone } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "Contact Us | HotVitality",
};

const CONTACT_INFO = [
  {
    icon: Mail,
    label: "Email",
    value: "hotvitality@gmail.com",
    href: "mailto:hotvitality@gmail.com",
  },
  {
    icon: Phone,
    label: "Phone / WhatsApp",
    value: "+1 (786) 757-7079",
    href: "tel:+17867577079",
  },
];

export default async function ContactPage() {
  // Same pattern as checkout/page.tsx: prefill for logged-in customers,
  // blank fields for guests either way.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
      {/* Stacks into a single column on mobile, splits into info + form
          side by side from `lg` up — same breakpoint as the checkout
          page's two-column layout. */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Contact Information
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Questions about an order, a product, or anything else? Reach us
            through any of the channels below, or send a message and
            we&apos;ll get back to you within one business day.
          </p>

          <div className="mt-8 flex flex-col gap-6">
            {CONTACT_INFO.map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <item.icon className="size-5 shrink-0 text-primary" />
                <div>
                  <h2 className="text-sm font-semibold text-foreground">
                    {item.label}
                  </h2>
                  <a
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {item.value}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <ContactForm
            initialName={initialName}
            initialEmail={user?.email ?? ""}
          />
        </div>
      </div>
    </div>
  );
}
