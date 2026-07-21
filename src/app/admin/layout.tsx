import Link from "next/link";
import { Leaf, Menu } from "lucide-react";

import { AdminNav } from "@/components/admin/admin-nav";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// The admin dashboard gets its own shell (sidebar + top bar) instead of
// the storefront's announcement bar / header / footer / WhatsApp button,
// which live in `(storefront)/layout.tsx`.
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar: fixed width, hidden below `md`. */}
      <aside className="hidden w-60 shrink-0 border-r border-border bg-card md:block">
        <div className="flex h-16 items-center justify-center gap-2 border-b border-border px-4 text-primary">
          <Leaf className="-translate-x-[15px] size-5" />
          <span className="-translate-x-[14px] font-bold text-foreground">HotVitality</span>
        </div>
        <div className="p-3">
          <AdminNav />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar: only shows the hamburger/menu below `md`, since the
            sidebar takes over from there. */}
        <header className="flex h-16 items-center gap-3 border-b border-border bg-card px-4 md:hidden">
          <Sheet>
            <SheetTrigger
              render={<Button variant="ghost" size="icon" className="md:hidden" />}
            >
              <Menu className="size-5" />
              <span className="sr-only">Open admin menu</span>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 text-primary">
                  <Leaf className="size-5" />
                  <span className="text-foreground">HotVitality</span>
                </SheetTitle>
              </SheetHeader>
              <div className="px-4">
                <AdminNav />
              </div>
            </SheetContent>
          </Sheet>

        </header>

        <main className="flex-1 bg-background p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
