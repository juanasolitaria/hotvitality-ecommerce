"use client";

import Link from "next/link";
import { Leaf } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default function LoginPage() {
  // No auth yet (Supabase comes later) — this just confirms the button
  // works so the form isn't a dead end during the UI-only phase.
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    toast.info("Login isn't wired up yet — check back soon!");
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-16 sm:px-6 lg:px-8">
      <Link href="/" className="flex items-center gap-2 text-primary">
        <Leaf className="size-7" />
        <span className="text-xl font-bold text-foreground">
          Hot Vitality
        </span>
      </Link>

      <Card className="mt-8 w-full max-w-sm">
        <CardContent>
          <h1 className="text-xl font-semibold text-foreground">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Log in to track orders and manage your account.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
            </div>

            <Button type="submit" className="mt-2 w-full">
              Log In
            </Button>
          </form>
        </CardContent>
      </Card>

      <p className="mt-6 text-sm text-muted-foreground">
        Just browsing?{" "}
        <Link href="/shop" className="font-medium text-primary hover:underline">
          Continue shopping
        </Link>
      </p>
    </div>
  );
}
