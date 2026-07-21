import Link from "next/link";
import { Leaf } from "lucide-react";

import { Separator } from "@/components/ui/separator";

// lucide-react only ships generic icons, not brand logos, so these social
// glyphs are small inline SVGs (standard Font Awesome brand icon paths,
// released under a free license) — same approach as the WhatsApp button.
function InstagramIcon() {
  return (
    <svg viewBox="0 0 448 512" fill="currentColor" className="size-5" aria-hidden="true">
      <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 320 512" fill="currentColor" className="size-5" aria-hidden="true">
      <path d="M279.1 288l14.2-92.7h-88.9v-60.1c0-25.4 12.4-50.1 52.2-50.1h40.4V6.3S260.4 0 225.4 0c-73.2 0-121 44.4-121 124.7v70.6H22.9V288h81.5v224h100.2V288z" />
    </svg>
  );
}

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
            <Link href="/" className="flex items-center gap-2 text-[#8fc3a8]">
              <Leaf className="size-6" />
              <span className="text-lg font-bold text-white">
                Hot Vitality
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-white/70">
              Premium dietary supplements to support your everyday wellness
              routine.
            </p>
            <div className="mt-4 flex gap-4 text-white/70">
              <Link href="#" aria-label="Instagram" className="hover:text-[#8fc3a8]">
                <InstagramIcon />
              </Link>
              <Link href="#" aria-label="Facebook" className="hover:text-[#8fc3a8]">
                <FacebookIcon />
              </Link>
            </div>
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
          &copy; {new Date().getFullYear()} Hot Vitality. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
