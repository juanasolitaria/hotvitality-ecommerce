export type Carrier = "UPS" | "USPS" | "FedEx";

// Carrier tracking-number formats aren't officially standardized, but each
// carrier has a few well-known, distinctive patterns — good enough to guess
// the carrier for display purposes. Returns null instead of guessing when
// the format isn't recognized, rather than risk showing the wrong carrier.
export function detectCarrier(trackingNumber: string): Carrier | null {
  const value = trackingNumber.replace(/[\s-]/g, "").toUpperCase();

  // UPS: "1Z" + 16 alphanumeric characters. Very distinctive, no overlap
  // with USPS or FedEx formats.
  if (/^1Z[0-9A-Z]{16}$/.test(value)) return "UPS";

  // USPS: domestic barcodes are 20-22 digits starting with one of a
  // handful of well-known service prefixes; international ones are two
  // letters + 9 digits + "US".
  if (/^(94|93|92|82)\d{18,20}$/.test(value)) return "USPS";
  if (/^[A-Z]{2}\d{9}US$/.test(value)) return "USPS";

  // FedEx: numeric tracking numbers at a few fixed lengths not already
  // claimed by USPS above.
  if (/^\d{12}$/.test(value) || /^\d{15}$/.test(value) || /^\d{20}$/.test(value)) {
    return "FedEx";
  }

  return null;
}

// Carrier-hosted tracking pages, for a "Track your package" link in the
// shipping-confirmation email — the one thing that actually works in an
// email client, unlike a copy-to-clipboard button (email clients strip
// JavaScript entirely, so there's no way to make one function).
export function getCarrierTrackingUrl(carrier: Carrier, trackingNumber: string): string {
  switch (carrier) {
    case "UPS":
      return `https://www.ups.com/track?tracknum=${encodeURIComponent(trackingNumber)}`;
    case "USPS":
      return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${encodeURIComponent(trackingNumber)}`;
    case "FedEx":
      return `https://www.fedex.com/fedextrack/?trknbr=${encodeURIComponent(trackingNumber)}`;
  }
}
