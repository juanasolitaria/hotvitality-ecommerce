import { Menu } from "lucide-react";
import { redirect } from "next/navigation";

import { AdminNav } from "@/components/admin/admin-nav";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "@/components/layout/logo";
import { createClient } from "@/lib/supabase/server";

// The admin dashboard gets its own shell (sidebar + top bar) instead of
// the storefront's announcement bar / header / footer / WhatsApp button,
// which live in `(storefront)/layout.tsx`.
//
// This layout wraps every /admin/* page, so this is also where we gate
// access: anyone not logged in, or logged in but not an admin, gets
// bounced before any admin page (or data) renders.
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/?auth=login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar: fixed width, hidden below `md`. */}
      <aside className="hidden w-60 shrink-0 border-r border-border bg-card md:block">
        <div className="flex h-16 items-center justify-center gap-2 border-b border-border px-4">
          <Logo />
          <span className="font-bold text-foreground">HotVitality</span>
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
                <SheetTitle className="flex items-center gap-2">
                  <Logo />
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
