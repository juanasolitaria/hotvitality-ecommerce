"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

// The Sonner toast component (used for "Added to cart" notifications)
// reads the current theme via next-themes, so it needs this provider
// somewhere above it in the tree. We're not building a dark mode toggle
// yet, so it's forced to "light" for now.
export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
