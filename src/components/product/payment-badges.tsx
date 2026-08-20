// Minimal payment-method badges shown on the product page so shoppers know
// how they can pay before they click through to Stripe Checkout. Only
// methods Stripe Checkout actually offers without extra setup: card
// networks, plus Apple Pay / Google Pay, which Stripe auto-enables on
// eligible devices with zero extra configuration. Nothing here implies a
// method (Amazon Pay, Klarna, etc.) that isn't confirmed enabled on the
// account — showing one that doesn't actually work at checkout would be
// misleading.
//
// Apple Pay / Google Pay use their actual traced marks (via Simple Icons,
// https://simpleicons.org — MIT-licensed, brand-accurate SVG paths), not
// hand-drawn approximations, since a "we accept" badge only works if it's
// instantly recognizable.
export function PaymentBadges() {
  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Accepted payment methods">
      <ApplePayBadge />
      <GooglePayBadge />
      <VisaBadge />
      <MastercardBadge />
      <AmexBadge />
      <DiscoverBadge />
    </div>
  );
}

const BADGE_WIDTH = 60;
const BADGE_HEIGHT = 38;

function ApplePayBadge() {
  return (
    <svg width={BADGE_WIDTH} height={BADGE_HEIGHT} viewBox={`0 0 ${BADGE_WIDTH} ${BADGE_HEIGHT}`} role="img" aria-label="Apple Pay">
      <rect width={BADGE_WIDTH} height={BADGE_HEIGHT} rx="6" fill="#000000" />
      {/* Simple Icons' Apple Pay mark bakes its own rounded-rect card
          frame into the path (as a second white outline just inside the
          edge) — fine on a plain background, but doubled up with our own
          black badge it read as an unwanted extra border. This path is
          the same mark with that frame subpath stripped out, keeping
          only the apple glyph + "Pay" wordmark, viewBox cropped to its
          real bounding box (measured via getBBox()). */}
      <svg x="9" y="10" width="42" height="18" viewBox="3.253 8.53 17.454 7.405">
        <path
          fill="#ffffff"
          d="M6.86 8.53c-.3.016-.668.199-.88.456-.191.22-.36.58-.316.918.338.03.675-.169.888-.418.205-.258.345-.603.308-.955zm2.207.42v5.493h.852v-1.877h1.18c1.078 0 1.835-.739 1.835-1.812 0-1.07-.742-1.805-1.808-1.805zm.852.719h.982c.739 0 1.161.396 1.161 1.089 0 .692-.422 1.092-1.164 1.092h-.979zm-3.154.3c-.45.01-.83.28-1.05.28-.235 0-.593-.264-.981-.257a1.446 1.446 0 0 0-1.23.747c-.527.908-.139 2.255.374 2.995.249.366.549.769.944.754.373-.014.52-.242.973-.242.454 0 .586.242.98.235.41-.007.667-.366.915-.733.286-.417.403-.82.41-.841-.007-.008-.79-.308-.797-1.209-.008-.754.615-1.113.644-1.135-.352-.52-.9-.578-1.09-.593a1.123 1.123 0 0 0-.092-.002zm8.204.397c-.99 0-1.606.533-1.652 1.256h.777c.072-.358.369-.586.845-.586.502 0 .803.266.803.711v.309l-1.097.064c-.951.054-1.488.484-1.488 1.184 0 .72.548 1.207 1.332 1.207.526 0 1.032-.281 1.264-.727h.019v.659h.788v-2.76c0-.803-.62-1.317-1.591-1.317zm1.94.072l1.446 4.009c0 .003-.073.24-.073.247-.125.41-.33.571-.711.571-.069 0-.206 0-.267-.015v.666c.06.011.267.019.335.019.83 0 1.226-.312 1.568-1.283l1.5-4.214h-.868l-1.012 3.259h-.015l-1.013-3.26zm-1.167 2.189v.316c0 .521-.45.917-1.024.917-.442 0-.731-.228-.731-.579 0-.342.278-.56.769-.593z"
        />
      </svg>
    </svg>
  );
}

function GooglePayBadge() {
  return (
    <svg width={BADGE_WIDTH} height={BADGE_HEIGHT} viewBox={`0 0 ${BADGE_WIDTH} ${BADGE_HEIGHT}`} role="img" aria-label="Google Pay">
      <rect width={BADGE_WIDTH - 1} height={BADGE_HEIGHT - 1} x="0.5" y="0.5" rx="6" fill="#ffffff" stroke="#e0e0e0" />
      {/* The real Google "G" mark (Google's own brand colors) instead of
          a single-color approximation — this is the same asset used in
          "Sign in with Google" buttons everywhere. */}
      <svg x="6" y="9" width="20" height="20" viewBox="0 0 18 18">
        <path fill="#4285F4" d="M17.64 9.2045c0-.6381-.0573-1.2518-.1636-1.8409H9v3.4814h4.8436c-.2086 1.125-.8427 2.0782-1.7959 2.7164v2.2581h2.9087c1.7018-1.5668 2.6836-3.8741 2.6836-6.615z" />
        <path fill="#34A853" d="M9 18c2.43 0 4.4673-.806 5.9564-2.1805l-2.9087-2.2581c-.8059.54-1.8368.8591-3.0477.8591-2.3436 0-4.3282-1.5831-5.036-3.7104H.9573v2.3318C2.4382 15.9832 5.4818 18 9 18z" />
        <path fill="#FBBC05" d="M3.964 10.71c-.18-.54-.2822-1.1168-.2822-1.71s.1023-1.17.2822-1.71V4.9582H.9573C.3477 6.1732 0 7.5477 0 9s.3477 2.8268.9573 4.0418L3.964 10.71z" />
        <path fill="#EA4335" d="M9 3.5795c1.3214 0 2.5077.4541 3.4405 1.346l2.5813-2.5814C13.4632.8918 11.4259 0 9 0 5.4818 0 2.4382 2.0168.9573 4.9582L3.964 7.29C4.6718 5.1627 6.6564 3.5795 9 3.5795z" />
      </svg>
      <text x="29" y="24" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="500" fill="#3c4043">
        Pay
      </text>
    </svg>
  );
}

function VisaBadge() {
  return (
    <svg width={BADGE_WIDTH} height={BADGE_HEIGHT} viewBox={`0 0 ${BADGE_WIDTH} ${BADGE_HEIGHT}`} role="img" aria-label="Visa">
      <rect width={BADGE_WIDTH} height={BADGE_HEIGHT} rx="6" fill="#1434CB" />
      <text
        x={BADGE_WIDTH / 2}
        y="25"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontSize="16"
        fontStyle="italic"
        fontWeight="700"
        fill="#ffffff"
      >
        VISA
      </text>
    </svg>
  );
}

function MastercardBadge() {
  return (
    <svg width={BADGE_WIDTH} height={BADGE_HEIGHT} viewBox={`0 0 ${BADGE_WIDTH} ${BADGE_HEIGHT}`} role="img" aria-label="Mastercard">
      <rect width={BADGE_WIDTH} height={BADGE_HEIGHT} rx="6" fill="#f3f3f3" />
      <circle cx="25" cy="19" r="11" fill="#EB001B" />
      <circle cx="35" cy="19" r="11" fill="#F79E1B" fillOpacity="0.9" />
    </svg>
  );
}

function AmexBadge() {
  return (
    <svg width={BADGE_WIDTH} height={BADGE_HEIGHT} viewBox={`0 0 ${BADGE_WIDTH} ${BADGE_HEIGHT}`} role="img" aria-label="American Express">
      <rect width={BADGE_WIDTH} height={BADGE_HEIGHT} rx="6" fill="#2E77BC" />
      <text
        x={BADGE_WIDTH / 2}
        y="24"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontSize="12.5"
        fontWeight="700"
        fill="#ffffff"
      >
        AMEX
      </text>
    </svg>
  );
}

function DiscoverBadge() {
  return (
    <svg width={BADGE_WIDTH} height={BADGE_HEIGHT} viewBox={`0 0 ${BADGE_WIDTH} ${BADGE_HEIGHT}`} role="img" aria-label="Discover">
      <rect width={BADGE_WIDTH} height={BADGE_HEIGHT} rx="6" fill="#1b1b1b" />
      <circle cx="50" cy="19" r="4.5" fill="#FF6000" />
      <text
        x="24"
        y="22"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontSize="8"
        fontWeight="700"
        fill="#ffffff"
      >
        DISCOVER
      </text>
    </svg>
  );
}
