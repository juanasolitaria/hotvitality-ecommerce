"use client";

import { CircleUserRound } from "lucide-react";

import { useAuthModal } from "@/lib/auth-modal-context";
import { Button } from "@/components/ui/button";

// Split out from Header (same reason as CartIndicator) — only this small
// piece needs to be a Client Component, to open the login/signup modal.
export function AccountButton() {
  const { open } = useAuthModal();

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
