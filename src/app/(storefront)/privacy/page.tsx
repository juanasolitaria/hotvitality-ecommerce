import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | HotVitality",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Last updated August 2026
      </p>

      <div className="mt-8 rounded-2xl border border-border bg-card text-sm leading-relaxed text-muted-foreground">
        <section className="px-6 py-3">
          <h2 className="text-lg font-semibold text-foreground">
            1. Information we collect
          </h2>
          <p className="mt-2">
            When you place an order, we collect your name, email address,
            phone number, and shipping address. If you create an account,
            we also store your login credentials (handled securely by our
            authentication provider, never as plain text). We don&apos;t
            collect or store your payment card details — those go directly
            to Stripe.
          </p>
        </section>

        <section className="px-6 py-3">
          <h2 className="text-lg font-semibold text-foreground">
            2. How we use your information
          </h2>
          <p className="mt-2">
            We use your information to process and ship your order, send
            order and account-related emails (confirmations, shipping
            updates), provide customer support, and — where you&apos;ve
            allowed it — send marketing communications as described below.
          </p>
        </section>

        <section className="px-6 py-3">
          <h2 className="text-lg font-semibold text-foreground">
            3. Marketing communications (email &amp; SMS)
          </h2>
          <p className="mt-2">
            <strong className="text-foreground">Email.</strong> By
            purchasing from us, you agree that we may send you promotional
            emails about products, restocks, and offers, in addition to
            order-related messages. You can unsubscribe from promotional
            email at any time using the &quot;unsubscribe&quot; link in any
            marketing email — this won&apos;t affect order or account
            emails, which we&apos;ll always need to send.
          </p>
          <p className="mt-2">
            <strong className="text-foreground">SMS.</strong> We only send
            promotional text messages to customers who explicitly opt in
            via the checkbox at checkout — placing an order alone does not
            enroll you in SMS marketing. Message and data rates may apply,
            and message frequency varies. You can opt out at any time by
            replying STOP to any text, or by contacting us directly.
          </p>
        </section>

        <section className="px-6 py-3">
          <h2 className="text-lg font-semibold text-foreground">
            4. Who we share information with
          </h2>
          <p className="mt-2">
            We don&apos;t sell your personal information. We share it only
            with the service providers that make the store work:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <strong className="text-foreground">Supabase</strong> —
              hosts our database, authentication, and product image
              storage.
            </li>
            <li>
              <strong className="text-foreground">Stripe</strong> —
              processes payments and handles your card details directly.
            </li>
            <li>
              <strong className="text-foreground">Resend</strong> — sends
              our transactional and marketing emails on our behalf.
            </li>
          </ul>
          <p className="mt-2">
            Each of these providers has its own privacy policy governing
            how it handles data on our behalf.
          </p>
        </section>

        <section className="px-6 py-3">
          <h2 className="text-lg font-semibold text-foreground">
            5. Cookies
          </h2>
          <p className="mt-2">
            We use a cookie to keep you signed in between visits if you
            have an account. We don&apos;t use third-party advertising or
            tracking cookies.
          </p>
        </section>

        <section className="px-6 py-3">
          <h2 className="text-lg font-semibold text-foreground">
            6. Data retention
          </h2>
          <p className="mt-2">
            We keep order records as long as needed for accounting, tax,
            and customer support purposes. If you have an account, you can
            ask us to delete it at any time (see below).
          </p>
        </section>

        <section className="px-6 py-3">
          <h2 className="text-lg font-semibold text-foreground">
            7. Your rights
          </h2>
          <p className="mt-2">
            You can ask us to access, correct, or delete the personal
            information we hold about you, or ask what we have on file, by
            emailing{" "}
            <a
              href="mailto:hotvitality@gmail.com"
              className="text-primary underline"
            >
              hotvitality@gmail.com
            </a>
            . We&apos;ll respond within a reasonable time.
          </p>
        </section>

        <section className="px-6 py-3">
          <h2 className="text-lg font-semibold text-foreground">
            8. Children&apos;s privacy
          </h2>
          <p className="mt-2">
            The Site isn&apos;t directed at children, and we don&apos;t
            knowingly collect personal information from anyone under 18.
          </p>
        </section>

        <section className="px-6 py-3">
          <h2 className="text-lg font-semibold text-foreground">
            9. Changes to this policy
          </h2>
          <p className="mt-2">
            We may update this Privacy Policy from time to time. Material
            changes will be reflected by updating the date at the top of
            this page.
          </p>
        </section>

        <section className="px-6 py-3">
          <h2 className="text-lg font-semibold text-foreground">
            10. Contact
          </h2>
          <p className="mt-2">
            Questions about this policy or your data? Reach us at{" "}
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
