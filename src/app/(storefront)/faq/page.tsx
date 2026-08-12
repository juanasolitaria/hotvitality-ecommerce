import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | HotVitality",
};

const FAQS = [
  {
    question: "Are HotVitality supplements FDA-approved?",
    answer:
      "Dietary supplements aren't approved by the FDA the way medications are. Our products are manufactured following good manufacturing practices, but as with any supplement, these statements haven't been evaluated by the Food and Drug Administration and our products aren't intended to diagnose, treat, cure, or prevent any disease.",
  },
  {
    question: "Should I talk to a doctor before taking a supplement?",
    answer:
      "Yes — especially if you're pregnant, nursing, have a medical condition, or take prescription medication. Consult a healthcare professional before starting any new supplement.",
  },
  {
    question: "How long does shipping take?",
    answer:
      "Orders are processed within 1–2 business days and typically arrive within 3–7 business days after that. See our Shipping Info page for full details.",
  },
  {
    question: "Do you ship outside the United States?",
    answer:
      "Not yet — we currently ship to U.S. addresses only.",
  },
  {
    question: "What's your return policy?",
    answer:
      "Unopened, sealed items can be returned within 14 days of delivery. If something arrives damaged, defective, or wrong, we'll make it right regardless of whether it's been opened. See our Returns & Refunds page for the full policy.",
  },
  {
    question: "Do I need an account to order?",
    answer:
      "No — you can check out as a guest. Creating an account just makes it easier to see your past orders.",
  },
  {
    question: "How do I track my order?",
    answer:
      "You'll get a confirmation email as soon as you pay, and a separate email with tracking information once your order ships.",
  },
  {
    question: "Can I change or cancel my order after placing it?",
    answer:
      "Contact us as soon as possible at hotvitality@gmail.com — if your order hasn't shipped yet, we'll do our best to change or cancel it. Once it's shipped, our standard return policy applies.",
  },
  {
    question: "Will I get marketing emails or texts?",
    answer:
      "Only if you opt in. By placing an order you may receive account and order-related emails from us, plus occasional promotional email — you can unsubscribe from promotional email at any time using the link in any email. Promotional SMS is opt-in only, via the checkbox at checkout; reply STOP to any text to opt out. See our Privacy Policy for details.",
  },
  {
    question: "Is my payment information safe?",
    answer:
      "Yes. Checkout is handled entirely by Stripe — your card details are entered on Stripe's own secure payment page and never touch our servers.",
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
        Frequently Asked Questions
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Can&apos;t find what you&apos;re looking for? Visit our{" "}
        <a href="/contact" className="text-primary underline">
          Contact page
        </a>
        .
      </p>

      <div className="mt-8 divide-y divide-border rounded-2xl border border-border bg-card">
        {FAQS.map((faq) => (
          <div key={faq.question} className="p-5">
            <h2 className="text-sm font-semibold text-foreground">
              {faq.question}
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
