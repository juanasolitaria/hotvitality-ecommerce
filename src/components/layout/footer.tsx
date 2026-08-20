import Link from "next/link";

import { Separator } from "@/components/ui/separator";
import { Logo } from "@/components/layout/logo";

const CUSTOMER_SERVICE_LINKS = [
  { href: "/contact", label: "Contact Us" },
  { href: "/shipping", label: "Shipping Info" },
  { href: "/returns", label: "Returns & Refunds" },
  { href: "/faq", label: "FAQ" },
];

const LEGAL_LINKS = [
  { href: "/terms", label: "Terms of Service" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/policies", label: "Store Policies" },
];

export function Footer() {
  return (
    // Dark-to-darker green gradient instead of the old cream background,
    // echoing the hero's dark/light green treatment — all text below
    // switches to light greens/white so it stays readable on the dark bg.
    <footer className="bg-gradient-to-b from-primary to-[#0f2419]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Stacks into a single column on mobile, spreads into three
            columns from the `sm` breakpoint up. */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <Logo />
              <span className="text-lg font-bold text-white">
                HotVitality
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-white/70">
              Premium dietary supplements to support your everyday wellness
              routine.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">
              Customer Service
            </h3>
            <ul className="mt-3 space-y-2">
              {CUSTOMER_SERVICE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-[#8fc3a8]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Legal</h3>
            <ul className="mt-3 space-y-2">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-[#8fc3a8]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-white/15" />

        <p className="text-center text-xs text-white/60">
          &copy; {new Date().getFullYear()} HotVitality. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
