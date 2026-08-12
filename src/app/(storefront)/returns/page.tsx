import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Returns & Refunds | HotVitality",
};

export default function ReturnsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
        Returns &amp; Refunds
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Last updated August 2026
      </p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="text-lg font-semibold text-foreground">
            14-day return window
          </h2>
          <p className="mt-2">
            Because our products are consumable dietary supplements, we can
            only accept returns of items that are unopened, unused, and in
            their original sealed packaging, within 14 days of delivery.
            For health and safety reasons, we&apos;re unable to accept
            returns of any product once its seal has been broken.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            Damaged, defective, or incorrect items
          </h2>
          <p className="mt-2">
            This 14-day / unopened rule doesn&apos;t apply if we made a
            mistake: if your order arrives damaged, defective, or different
            from what you ordered, contact us within 7 days of delivery and
            we&apos;ll send a replacement or a full refund at no cost to
            you — opened or not.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            How to start a return
          </h2>
          <p className="mt-2">
            Email{" "}
            <a
              href="mailto:hotvitality@gmail.com"
              className="text-primary underline"
            >
              hotvitality@gmail.com
            </a>{" "}
            with your order number and the reason for the return. We&apos;ll
            confirm whether it qualifies and send instructions for sending
            it back. Please don&apos;t ship anything back before hearing
            from us first.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            Return shipping
          </h2>
          <p className="mt-2">
            For eligible unopened returns, the customer is responsible for
            return shipping costs. For damaged, defective, or incorrect
            items, we cover return shipping.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            Refunds
          </h2>
          <p className="mt-2">
            Once we receive and inspect your return, we&apos;ll notify you
            by email whether it&apos;s approved. Approved refunds are
            issued to your original payment method within 5–10 business
            days, depending on your bank or card issuer. Original shipping
            fees are non-refundable unless the return is due to our error.
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
