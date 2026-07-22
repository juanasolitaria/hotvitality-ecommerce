"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  Suspense,
  type ReactNode,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";

export type AuthModalView = "login" | "signup";

interface AuthModalContextValue {
  isOpen: boolean;
  view: AuthModalView;
  open: (view?: AuthModalView) => void;
  close: () => void;
  setView: (view: AuthModalView) => void;
}

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

// Lets any page open the login/signup modal from anywhere (the header's
// account button, or a server redirect landing on `/?auth=login` — see
// `admin/layout.tsx` and `account/page.tsx`, which bounce unauthenticated
// visitors here instead of to a dedicated /login page).
export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<AuthModalView>("login");

  function open(nextView: AuthModalView = "login") {
    setView(nextView);
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  return (
    <AuthModalContext.Provider value={{ isOpen, view, open, close, setView }}>
      {/* `useSearchParams` needs a Suspense boundary in Next 14 — isolated
          here in its own no-op component so it doesn't force the entire
          storefront into client-side rendering. */}
      <Suspense fallback={null}>
        <AuthModalUrlSync onOpen={open} />
      </Suspense>
      {children}
    </AuthModalContext.Provider>
  );
}

function AuthModalUrlSync({
  onOpen,
}: {
  onOpen: (view: AuthModalView) => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const authParam = searchParams.get("auth");
    if (authParam === "login" || authParam === "signup") {
      onOpen(authParam);
      // Strip the query param once we've read it so refreshing/sharing
      // the URL afterward doesn't keep popping the modal back open.
      router.replace("/", { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return null;
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error("useAuthModal must be used within an AuthModalProvider");
  }
  return context;
}
