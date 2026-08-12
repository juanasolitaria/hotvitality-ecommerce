"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import { useAuthModal } from "@/lib/auth-modal-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Logo } from "@/components/layout/logo";

// The login/signup UI used to be two separate pages. Now it's one modal
// reachable from anywhere via `useAuthModal()` (the header's account
// button, or a server-side redirect landing on `/?auth=login` — see
// `admin/layout.tsx`). The Supabase calls below are the same ones those
// pages used to make; only where the result sends the user changed.
export function AuthModal() {
  const { isOpen, view, setView, close } = useAuthModal();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <DialogContent className="max-w-[calc(100%-2rem)] gap-6 rounded-2xl bg-white p-8 sm:max-w-md">
        <div className="flex flex-col items-center gap-2 text-center">
          <Logo className="size-12" />
          <h2 className="text-xl font-bold text-foreground">
            {view === "login" ? "Iniciar sesión" : "Crear cuenta"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {view === "login"
              ? "Ingresa a tu cuenta para seguir tus pedidos."
              : "Regístrate para comprar más rápido y seguir tus pedidos."}
          </p>
        </div>

        {view === "login" ? <LoginForm /> : <SignupForm />}

        <p className="text-center text-sm text-muted-foreground">
          {view === "login" ? (
            <>
              ¿No tienes una cuenta?{" "}
              <button
                type="button"
                onClick={() => setView("signup")}
                className="font-medium text-primary hover:underline"
              >
                Crear cuenta
              </button>
            </>
          ) : (
            <>
              ¿Ya tienes una cuenta?{" "}
              <button
                type="button"
                onClick={() => setView("login")}
                className="font-medium text-primary hover:underline"
              >
                Iniciar sesión
              </button>
            </>
          )}
        </p>
      </DialogContent>
    </Dialog>
  );
}

function LoginForm() {
  const router = useRouter();
  const { close } = useAuthModal();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      toast.error(error?.message ?? "Could not log in");
      setLoading(false);
      return;
    }

    toast.success("Welcome back!");
    close();
    router.push("/");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="login-email">Email</Label>
        <Input
          id="login-email"
          type="email"
          placeholder="you@example.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="login-password">Password</Label>
          <Link
            href="/forgot-password"
            onClick={close}
            className="text-xs font-medium text-primary hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
        <Input
          id="login-password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <Button type="submit" className="mt-2 w-full" disabled={loading}>
        {loading ? "Ingresando..." : "Iniciar sesión"}
      </Button>
    </form>
  );
}

function SignupForm() {
  const router = useRouter();
  const { close, setView } = useAuthModal();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    // `options.data` lands in `raw_user_meta_data`, which our
    // `handle_new_user` trigger reads to fill in `profiles.full_name`.
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    // If "Confirm email" is on in the Supabase project's Auth settings,
    // there's no session yet — the account exists but needs the email
    // link clicked before it can log in.
    if (!data.session) {
      toast.success("Check your email to confirm your account.");
      setView("login");
      return;
    }

    toast.success("Account created!");
    close();
    router.push("/account");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="signup-name">Nombre completo</Label>
        <Input
          id="signup-name"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="signup-email">Email</Label>
        <Input
          id="signup-email"
          type="email"
          placeholder="you@example.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="signup-password">Password</Label>
        <Input
          id="signup-password"
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <Button type="submit" className="mt-2 w-full" disabled={loading}>
        {loading ? "Creando cuenta..." : "Crear cuenta"}
      </Button>
    </form>
  );
}
