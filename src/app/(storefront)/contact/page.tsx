import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us | HotVitality",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
        Contact Us
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Questions about an order, a product, or anything else? Reach us
        through any of the channels below — we usually reply within one
        business day.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5">
          <Mail className="mt-0.5 size-5 shrink-0 text-primary" />
          <div>
            <h2 className="text-sm font-semibold text-foreground">Email</h2>
            <a
              href="mailto:hotvitality@gmail.com"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              hotvitality@gmail.com
            </a>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5">
          <Phone className="mt-0.5 size-5 shrink-0 text-primary" />
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Phone / WhatsApp
            </h2>
            <a
              href="tel:+17867577079"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              +1 (786) 757-7079
            </a>
            <p className="mt-1 text-xs text-muted-foreground">
              Fastest way to reach us — tap the WhatsApp button in the
              corner of any page.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5 sm:col-span-2">
          <MapPin className="mt-0.5 size-5 shrink-0 text-primary" />
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Business Address
            </h2>
            <p className="text-sm text-muted-foreground">
              3050 NW 84th Ave, Doral, FL, United States
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
