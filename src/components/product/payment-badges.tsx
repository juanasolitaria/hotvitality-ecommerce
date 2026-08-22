// Minimal payment-method badges shown on the product page so shoppers know
// how they can pay before they click through to Stripe Checkout. Only
// methods actually confirmed enabled on the Stripe account — nothing here
// implies a method that isn't, since a badge that doesn't work at checkout
// would be misleading.
//
// Apple Pay / Google Pay / Amazon Pay use their actual traced marks (via
// Simple Icons, https://simpleicons.org — MIT-licensed, brand-accurate SVG
// paths), not hand-drawn approximations, since a "we accept" badge only
// works if it's instantly recognizable.
export function PaymentBadges() {
  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Accepted payment methods">
      <ApplePayBadge />
      <GooglePayBadge />
      <AmazonPayBadge />
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

function AmazonPayBadge() {
  return (
    <svg width={BADGE_WIDTH} height={BADGE_HEIGHT} viewBox={`0 0 ${BADGE_WIDTH} ${BADGE_HEIGHT}`} role="img" aria-label="Amazon Pay">
      <rect width={BADGE_WIDTH - 1} height={BADGE_HEIGHT - 1} x="0.5" y="0.5" rx="6" fill="#ffffff" stroke="#e0e0e0" />
      {/* Simple Icons' mark is normalized into a 24x24 viewBox with empty
          space above/below the actual wordmark+smile-arrow — cropped here
          to its real bounding box (measured via svg-path-bbox) so it fills
          the badge properly instead of sitting tiny in the middle. */}
      <svg x="10" y="8" width="40" height="25" viewBox="0 4.5064 24 14.9936">
        <path
          fill="#1b1b1b"
          d="M14.3781 4.9945C14.0049 4.6718 13.4251 4.5102 12.638 4.5102 12.2485 4.5102 11.859 4.5457 11.4696 4.6156 11.0795 4.6862 10.7524 4.7792 10.4872 4.8953 10.3879 4.9371 10.3212 4.9802 10.2881 5.0257 10.255 5.0713 10.2381 5.1524 10.2381 5.2679V5.6031C10.2381 5.7522 10.2918 5.8271 10.3998 5.8271A0.337 0.337 0 0 0 10.5059 5.8084C10.5433 5.7959 10.5746 5.7859 10.5989 5.7772 11.2374 5.5868 11.8459 5.4913 12.4264 5.4913 12.9232 5.4913 13.2715 5.5825 13.4706 5.7653 13.6697 5.9476 13.769 6.2622 13.769 6.7097V7.5298C13.1891 7.3888 12.6667 7.3188 12.2023 7.3188 11.4733 7.3188 10.8935 7.4992 10.4623 7.8594 10.0315 8.2195 9.8156 8.7026 9.8156 9.3074 9.8156 9.8716 9.9897 10.3204 10.338 10.6562 10.6857 10.992 11.1581 11.1592 11.7548 11.1592 12.1112 11.1592 12.4695 11.0887 12.8302 10.9483 13.191 10.8079 13.5199 10.6081 13.8182 10.3516L13.8807 10.7616C13.9057 10.919 13.9967 10.9976 14.1547 10.9976H14.689C14.8544 10.9976 14.938 10.9146 14.938 10.7492V6.4987C14.9374 5.819 14.7508 5.3178 14.3781 4.9945ZM13.769 9.5945C13.4956 9.8017 13.2097 9.959 12.9114 10.067 12.613 10.175 12.3272 10.2287 12.0538 10.2287 11.7305 10.2287 11.4821 10.1437 11.3079 9.974 11.1338 9.8042 11.047 9.562 11.047 9.2469 11.047 8.5259 11.5152 8.1652 12.4514 8.1652 12.6667 8.1652 12.8883 8.1802 13.1161 8.2089 13.3439 8.2382 13.5617 8.2776 13.769 8.3269ZM8.7726 6.402C8.6522 6 8.4806 5.658 8.2565 5.3765 8.033 5.095 7.7596 4.879 7.4363 4.7299 7.1136 4.5807 6.7529 4.5064 6.3547 4.5064 5.982 4.5064 5.6169 4.5764 5.2611 4.7174 4.9048 4.8584 4.569 5.0657 4.2538 5.339L4.192 4.9408C4.167 4.7754 4.0715 4.6924 3.9055 4.6924H3.3587C3.1933 4.6924 3.1103 4.7754 3.1103 4.9408V13.307C3.1103 13.473 3.1933 13.5554 3.3587 13.5554H4.0921C4.2581 13.5554 4.3405 13.4724 4.3405 13.307V10.3984C4.8792 10.8871 5.5215 11.1318 6.2673 11.1318 6.673 11.1318 7.0419 11.0507 7.3733 10.8896 7.7047 10.728 7.9862 10.502 8.2183 10.2118 8.4506 9.9222 8.6309 9.5702 8.7589 9.1551 8.8875 8.7407 8.9518 8.2763 8.9518 7.7626 8.953 7.2576 8.8925 6.8039 8.7726 6.402ZM5.982 10.1369C5.4178 10.1369 4.871 9.9384 4.3411 9.5402V6.0724C4.8629 5.6911 5.4184 5.5007 6.0071 5.5007 7.1342 5.5007 7.6978 6.2759 7.6978 7.825 7.6972 9.3667 7.1255 10.1369 5.982 10.1369ZM18.9825 12.0999L21.7175 5.1387C21.775 4.9977 21.8043 4.8984 21.8043 4.8403 21.8043 4.7411 21.7463 4.6912 21.6302 4.6912H20.9342C20.8013 4.6912 20.7108 4.7124 20.6602 4.7536 20.6103 4.7954 20.561 4.8866 20.5111 5.0276L18.8327 9.8504 17.0926 5.0276C17.0426 4.8866 16.9933 4.7954 16.9434 4.7536 16.8934 4.7124 16.8024 4.6912 16.6694 4.6912H15.9235C15.8075 4.6912 15.7494 4.7411 15.7494 4.8403 15.7494 4.8983 15.7781 4.9976 15.8362 5.1387L18.2354 11.0557 17.9994 11.6898C17.8584 12.088 17.7011 12.3614 17.527 12.5106 17.3529 12.6597 17.1082 12.734 16.7936 12.734 16.6526 12.734 16.5408 12.7253 16.4584 12.709 16.3754 12.6928 16.313 12.684 16.2718 12.684 16.1476 12.684 16.0852 12.7627 16.0852 12.92V13.2433C16.0852 13.3594 16.1058 13.4443 16.1476 13.498 16.1888 13.5516 16.255 13.5916 16.3467 13.616 16.5533 13.6734 16.7899 13.7033 17.0551 13.7033 17.5276 13.7033 17.9108 13.5791 18.2048 13.3301 18.5 13.0823 18.7591 12.6716 18.9825 12.0999"
        />
        {/* The smile-and-arrow swoosh (Amazon's signature mark) is its own
            pair of subpaths at the end of the combined icon — split out
            here so it keeps its brand orange instead of matching the
            wordmark's black. */}
        <path
          fill="#FF9900"
          d="M21.6938 16.5232C19.0662 18.4625 15.2569 19.4936 11.9764 19.4936 7.3789 19.4936 3.2389 17.794 0.1063 14.9653-0.1397 14.7432 0.0794 14.4398 0.3753 14.6121 3.7551 16.5788 7.935 17.7634 12.2523 17.7634 15.1646 17.7634 18.3659 17.1592 21.3119 15.9097 21.7556 15.7206 22.1282 16.2018 21.6939 16.5232M22.7867 15.2749C23.1231 15.7056 22.4129 17.4789 22.0957 18.2709 21.9997 18.5105 22.2057 18.6073 22.4228 18.4257 23.8322 17.2467 24.1967 14.7757 23.9083 14.4186 23.6218 14.0647 21.1577 13.7601 19.6535 14.8162 19.4219 14.9785 19.4619 15.2032 19.7184 15.1719 20.5654 15.0709 22.4509 14.8443 22.7867 15.2749Z"
        />
      </svg>
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
