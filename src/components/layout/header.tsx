import Link from "next/link";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "@/components/layout/logo";
import { CartIndicator } from "@/components/layout/cart-indicator";
import { AccountButton } from "@/components/layout/account-button";
import { createClient } from "@/lib/supabase/server";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/shop", label: "Deals" },
];

export async function Header() {
  // Fetched here (Server Component) rather than in AccountButton so
  // there's no logged-out flash while a client-side check resolves —
  // the header already knows the auth state on first paint.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-[#c5e9c8]">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* Mobile nav: a hamburger button that opens a slide-in Sheet.
            Only visible below the `md` breakpoint (mobile-first). */}
        <Sheet>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon" className="md:hidden" />
            }
          >
            <Menu className="size-5" />
            <span className="sr-only">Open menu</span>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <SheetHeader>
              <SheetTitle>HotVitality</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 px-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="rounded-md px-2 py-2 text-sm font-medium text-foreground hover:bg-accent"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link href="/" className="mr-2 flex items-center gap-2">
          <Logo />
          <span className="text-lg font-bold tracking-tight text-[#2e3832]">
            HotVitality
          </span>
        </Link>

        {/* nav links */}

        {/* Desktop nav: hidden on mobile, shown from `md` up. */}
        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-[#373c26] transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {/* Account button: icon-only, no label. Logged out, it opens
              the login/signup modal on click. Logged in, hovering
              reveals a Dashboard/Log out menu (see AccountButton). */}
          <AccountButton user={user} />
          <CartIndicator />
        </div>
      </div>
    </header>
  );
}
