"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Logo } from "@/components/layout/logo";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/confirm?next=/update-password`,
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    setSent(true);
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
          {sent ? (
            <>
              <h1 className="text-xl font-semibold text-foreground">
                Check your email
              </h1>
              {/* Deliberately vague about whether the account exists —
                  otherwise this form could be used to check which emails
                  are registered. */}
              <p className="mt-2 text-sm text-muted-foreground">
                If an account exists for {email}, we sent a link to reset
                its password.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-xl font-semibold text-foreground">
                Reset your password
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Enter your email and we&apos;ll send you a link to reset it.
              </p>

              <form
                onSubmit={handleSubmit}
                className="mt-6 flex flex-col gap-4"
              >
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <Button type="submit" className="mt-2 w-full" disabled={loading}>
                  {loading ? "Sending..." : "Send reset link"}
                </Button>
              </form>
            </>
          )}
        </CardContent>
      </Card>

      <p className="mt-6 text-sm text-muted-foreground">
        <Link
          href="/?auth=login"
          className="font-medium text-primary hover:underline"
        >
          Back to log in
        </Link>
      </p>
    </div>
  );
}
