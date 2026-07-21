import Link from "next/link";
import { Leaf, Menu, Search, ShoppingCart, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { mockCartItems, getCartItemCount } from "@/data/cart";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/shop", label: "Deals" },
];

export function Header() {
  const cartCount = getCartItemCount(mockCartItems);

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
              <SheetTitle>Hot Vitality</SheetTitle>
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
        <Link href="/" className=" mr-2 flex items-center gap-2 text-primary">
          <Leaf className="size-6" />
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
          {/* Minimalist login button: transparent with a primary-colored
              border/text by default, and the colors fully invert (solid
              primary background, light text) on hover. */}
          <Button
            render={<Link href="/login" />}
            nativeButton={false}
            variant="outline"
            size="sm"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <User className="size-4" />
            <span className="hidden sm:inline">Log In</span>
          </Button>

          <Button
            render={<Link href="/cart" />}
            nativeButton={false}
            variant="ghost"
            size="icon"
            className="relative"
          >
            <ShoppingCart className="size-5" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                {cartCount}
              </span>
            )}
            <span className="sr-only">Cart</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
