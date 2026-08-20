import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | HotVitality",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
        Terms of Service
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Last updated August 2026
      </p>

      <div className="mt-8 rounded-2xl border border-border bg-card text-sm leading-relaxed text-muted-foreground">
        <section className="px-6 py-3">
          <h2 className="text-lg font-semibold text-foreground">
            1. Agreement to terms
          </h2>
          <p className="mt-2">
            These Terms of Service govern your use of hot-vitality.com (the
            &quot;Site&quot;) and any purchase you make through it. By
            browsing the Site or placing an order, you agree to these
            terms. If you don&apos;t agree, please don&apos;t use the Site.
          </p>
        </section>

        <section className="px-6 py-3">
          <h2 className="text-lg font-semibold text-foreground">
            2. Not medical advice
          </h2>
          <p className="mt-2">
            HotVitality sells dietary supplements. Nothing on this Site is
            medical advice, and our products are not intended to diagnose,
            treat, cure, or prevent any disease. These statements have not
            been evaluated by the Food and Drug Administration. Talk to a
            healthcare professional before starting any new supplement,
            especially if you are pregnant, nursing, have a medical
            condition, or take medication. Keep all products out of reach
            of children.
          </p>
        </section>

        <section className="px-6 py-3">
          <h2 className="text-lg font-semibold text-foreground">
            3. Orders and payment
          </h2>
          <p className="mt-2">
            All prices are shown in U.S. dollars. We reserve the right to
            refuse or cancel any order, including in cases of suspected
            fraud, pricing errors, or product unavailability — if that
            happens after you&apos;ve been charged, we&apos;ll issue a full
            refund. Payment is processed securely by Stripe; we never see
            or store your full card details.
          </p>
        </section>

        <section className="px-6 py-3">
          <h2 className="text-lg font-semibold text-foreground">
            4. Shipping and returns
          </h2>
          <p className="mt-2">
            See our{" "}
            <a href="/shipping" className="text-primary underline">
              Shipping Info
            </a>{" "}
            and{" "}
            <a href="/returns" className="text-primary underline">
              Returns &amp; Refunds
            </a>{" "}
            pages, which are part of these Terms.
          </p>
        </section>

        <section className="px-6 py-3">
          <h2 className="text-lg font-semibold text-foreground">
            5. Account use
          </h2>
          <p className="mt-2">
            If you create an account, you&apos;re responsible for keeping
            your login credentials secure and for any activity under your
            account. You must be at least 18 years old, or have a
            parent/guardian&apos;s permission, to create an account or
            place an order.
          </p>
        </section>

        <section className="px-6 py-3">
          <h2 className="text-lg font-semibold text-foreground">
            6. Marketing communications
          </h2>
          <p className="mt-2">
            When you place an order, we may send you promotional emails
            about products, offers, and updates, in addition to
            order-related messages — you can unsubscribe from promotional
            email at any time via the link in the email. Promotional text
            messages are sent only if you separately opt in at checkout,
            and you can opt out at any time by replying STOP. See our{" "}
            <a href="/privacy" className="text-primary underline">
              Privacy Policy
            </a>{" "}
            for more detail.
          </p>
        </section>

        <section className="px-6 py-3">
          <h2 className="text-lg font-semibold text-foreground">
            7. Intellectual property
          </h2>
          <p className="mt-2">
            All content on this Site — text, graphics, logos, and images —
            belongs to HotVitality or its licensors and may not be used
            without our written permission.
          </p>
        </section>

        <section className="px-6 py-3">
          <h2 className="text-lg font-semibold text-foreground">
            8. Limitation of liability
          </h2>
          <p className="mt-2">
            To the fullest extent permitted by law, HotVitality is not
            liable for any indirect, incidental, or consequential damages
            arising from your use of the Site or our products. Our total
            liability for any claim is limited to the amount you paid for
            the product giving rise to the claim.
          </p>
        </section>

        <section className="px-6 py-3">
          <h2 className="text-lg font-semibold text-foreground">
            9. Governing law
          </h2>
          <p className="mt-2">
            These Terms are governed by the laws of the State of Florida,
            United States, without regard to conflict-of-law principles.
          </p>
        </section>

        <section className="px-6 py-3">
          <h2 className="text-lg font-semibold text-foreground">
            10. Changes to these terms
          </h2>
          <p className="mt-2">
            We may update these Terms from time to time. Continued use of
            the Site after changes are posted means you accept the updated
            terms.
          </p>
        </section>

        <section className="px-6 py-3">
          <h2 className="text-lg font-semibold text-foreground">
            11. Contact
          </h2>
          <p className="mt-2">
            Questions about these Terms? Reach us at{" "}
            <a
              href="mailto:hotvitality@gmail.com"
              className="text-primary underline"
            >
              hotvitality@gmail.com
            </a>{" "}
            or see our{" "}
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
