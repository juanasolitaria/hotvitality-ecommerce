import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Info | HotVitality",
};

export default function ShippingPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
        Shipping Info
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Last updated August 2026
      </p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="text-lg font-semibold text-foreground">
            Shipping rates
          </h2>
          <p className="mt-2">
            Shipping is free on every order within the United States, no
            minimum required. There are no membership requirements or
            hidden fees — the total you see at checkout is the total you
            pay.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            Where we ship
          </h2>
          <p className="mt-2">
            We currently ship to addresses within the United States only.
            We don&apos;t offer international shipping yet — if that
            changes, this page will be updated.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            Processing time
          </h2>
          <p className="mt-2">
            Orders are packed and handed off to the carrier within 1–2
            business days of payment clearing. You&apos;ll get an order
            confirmation email as soon as your payment goes through, and a
            separate notification once your order ships.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            Delivery time
          </h2>
          <p className="mt-2">
            Once shipped, most orders arrive within 3–7 business days,
            depending on your location and the carrier. Delivery estimates
            aren&apos;t guaranteed — weather, carrier delays, and
            high-volume periods (holidays, promotions) can push things out.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            Order tracking
          </h2>
          <p className="mt-2">
            We&apos;ll email tracking information as soon as your label is
            created. If you haven&apos;t received tracking within 3
            business days of your order shipping, reach out and
            we&apos;ll look into it.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            Lost, delayed, or damaged packages
          </h2>
          <p className="mt-2">
            If your package arrives damaged, or tracking shows it as
            delivered but you never received it, contact us within 7 days
            so we can start a claim with the carrier and get a replacement
            or refund sorted out.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            Questions?
          </h2>
          <p className="mt-2">
            Reach out any time — see our{" "}
            <a href="/contact" className="text-primary underline">
              Contact page
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
