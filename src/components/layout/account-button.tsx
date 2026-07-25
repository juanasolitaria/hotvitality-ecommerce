"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CircleUserRound, LayoutDashboard, LogOut } from "lucide-react";
import type { User } from "@supabase/supabase-js";

import { useAuthModal } from "@/lib/auth-modal-context";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Split out from Header (same reason as CartIndicator) — only this small
// piece needs to be a Client Component.
export function AccountButton({ user }: { user: User | null }) {
  const { open } = useAuthModal();

  // Logged out: a plain button that opens the login/signup modal.
  if (!user) {
    return (
      <Button
        variant="ghost"
        size="icon-lg"
        className="text-primary hover:bg-primary/10"
        onClick={() => open("login")}
      >
        <CircleUserRound className="size-6" strokeWidth={1.5} />
        <span className="sr-only">Account</span>
      </Button>
    );
  }

  // Logged in: hovering reveals Dashboard / Log out.
  return <LoggedInAccountMenu />;
}

function LoggedInAccountMenu() {
  const router = useRouter();

  // Same hover-open/close pattern the login/signup dropdown used to use:
  // a short close delay so the menu survives the cursor crossing the gap
  // between the button and the popup (the popup renders in a portal,
  // outside this element).
  const [menuOpen, setMenuOpen] = useState(false);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMenu = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setMenuOpen(true);
  };

  const closeMenu = () => {
    closeTimeoutRef.current = setTimeout(() => setMenuOpen(false), 150);
  };

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setMenuOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <div onMouseEnter={openMenu} onMouseLeave={closeMenu}>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-lg"
              className="text-primary hover:bg-primary/10"
            />
          }
        >
          <CircleUserRound className="size-6" strokeWidth={1.5} />
          <span className="sr-only">Account</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          onMouseEnter={openMenu}
          onMouseLeave={closeMenu}
          className="min-w-44"
        >
          <DropdownMenuItem render={<Link href="/account" />}>
            <LayoutDashboard className="size-4" />
            Dashboard
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onClick={handleLogout}>
            <LogOut className="size-4" />
            Cerrar sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
