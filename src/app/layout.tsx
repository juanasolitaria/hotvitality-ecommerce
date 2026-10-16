import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

// Inter is loaded once here and exposed as the `--font-sans` CSS variable,
// which globals.css then applies to the whole site via `font-sans`.
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "HotVitality | Dietary Supplements",
  description:
    "HotVitality — premium dietary supplements to support your everyday wellness.",
  // Proves domain ownership to Google Business Profile (and Search Console,
  // which issues the same token) — renders as
  // <meta name="google-site-verification" content="..." /> in <head>.
  // Safe to leave here permanently even after verification succeeds.
  verification: {
    google: "2CVCSXYkgYuQt3cotZoMDto7vzudzALKLZXa2r4cu0c",
  },
};

// This root layout stays intentionally bare (just fonts, theme, and toasts)
// because the storefront and the admin dashboard need very different page
// chrome — the storefront's header/footer/WhatsApp button live in
// `(storefront)/layout.tsx`, and the admin sidebar lives in
// `admin/layout.tsx`. Both are nested inside this one.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // next-themes adds a "light"/"dark" class to <html> right before
    // hydration, which would otherwise trigger a harmless but noisy
    // hydration-mismatch warning — suppressHydrationWarning silences
    // just that one known, expected mismatch.
    <html
      lang="en"
      className={cn("font-sans", inter.variable)}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col antialiased">
        <ThemeProvider attribute="class" forcedTheme="light">
          {children}
          <Toaster position="bottom-right" />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
