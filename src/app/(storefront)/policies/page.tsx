import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Store Policies | HotVitality",
};

const POLICY_LINKS = [
  {
    href: "/shipping",
    title: "Shipping Info",
    description: "Rates, delivery times, and where we ship.",
  },
  {
    href: "/returns",
    title: "Returns & Refunds",
    description: "Our 14-day return window and how to request one.",
  },
  {
    href: "/terms",
    title: "Terms of Service",
    description: "The rules for using the Site and placing an order.",
  },
  {
    href: "/privacy",
    title: "Privacy Policy",
    description: "What we collect, how we use it, and your marketing preferences.",
  },
];

export default function PoliciesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
        Store Policies
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        A quick overview of how we do business, plus links to the full
        policies.
      </p>

      <div className="mt-8 rounded-2xl border border-border bg-card text-sm leading-relaxed text-muted-foreground">
        <section className="px-6 py-3">
          <h2 className="text-lg font-semibold text-foreground">
            Supplement safety
          </h2>
          <p className="mt-2">
            Our products are dietary supplements, not medications. These
            statements have not been evaluated by the Food and Drug
            Administration, and our products are not intended to diagnose,
            treat, cure, or prevent any disease. Consult a healthcare
            professional before starting any new supplement, particularly
            if you&apos;re pregnant, nursing, have a medical condition, or
            take medication. Keep all products out of reach of children.
          </p>
        </section>

        <section className="px-6 py-3">
          <h2 className="text-lg font-semibold text-foreground">
            Payment
          </h2>
          <p className="mt-2">
            We accept all major credit and debit cards through Stripe.
            Payment is captured only once your order is placed — card
            details are entered on Stripe&apos;s own secure page and never
            touch our servers.
          </p>
        </section>

        <section className="px-6 py-3">
          <h2 className="text-lg font-semibold text-foreground">
            Order changes &amp; cancellations
          </h2>
          <p className="mt-2">
            Contact us as soon as possible if you need to change or cancel
            an order — we can usually accommodate requests made before the
            order has shipped.
          </p>
        </section>

        <section className="px-6 py-3">
          <h2 className="text-lg font-semibold text-foreground">
            Marketing communications
          </h2>
          <p className="mt-2">
            Placing an order means you may receive promotional emails from
            us in addition to order updates (unsubscribe any time). SMS
            marketing is opt-in only, via the checkbox at checkout. Full
            details are in our{" "}
            <Link href="/privacy" className="text-primary underline">
              Privacy Policy
            </Link>
            .
          </p>
        </section>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {POLICY_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group flex items-center justify-between rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary"
          >
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                {link.title}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {link.description}
              </p>
            </div>
            <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
          </Link>
        ))}
      </div>
    </div>
  );
}
