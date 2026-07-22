"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Logo } from "@/components/layout/logo";

// Reached after clicking the link in a password-reset email — by the time
// the user lands here, `/auth/confirm` has already verified the link and
// created a real session, so we can just set a new password directly.
export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Password updated!");
    router.push("/account");
    router.refresh();
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-16 sm:px-6 lg:px-8">
      <Link href="/" className="flex items-center gap-2">
        <Logo className="size-10" />
        <span className="text-xl font-bold text-foreground">
          Hot Vitality
        </span>
      </Link>

      <Card className="mt-8 w-full max-w-sm">
        <CardContent>
          <h1 className="text-xl font-semibold text-foreground">
            Set a new password
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose a new password for your account.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">New password</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button type="submit" className="mt-2 w-full" disabled={loading}>
              {loading ? "Saving..." : "Update password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
