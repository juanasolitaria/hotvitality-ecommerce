import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { AuthModal } from "@/components/layout/auth-modal";
import { CartProvider } from "@/lib/cart-context";
import { AuthModalProvider } from "@/lib/auth-modal-context";

// The customer-facing chrome (announcement bar, header, footer, WhatsApp
// button) lives here instead of the root layout so the /admin dashboard
// can use its own sidebar shell without also getting a storefront header.
export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthModalProvider>
      <CartProvider>
        <AnnouncementBar />
        <Header />
        {/* `flex-1` lets short pages still push the footer to the bottom of
            the viewport instead of leaving a gap underneath it. */}
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
        <AuthModal />
      </CartProvider>
    </AuthModalProvider>
  );
}
