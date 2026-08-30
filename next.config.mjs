const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      // Lets Server Actions (e.g. checkout) work when testing from a phone
      // on the same Wi-Fi, hitting the dev machine's LAN IP instead of
      // localhost — Next.js rejects Server Action requests from origins it
      // doesn't recognize as a CSRF protection, so the phone's origin has
      // to be listed here explicitly. Update this IP if it ever changes
      // (check with `ipconfig` / `Get-NetIPAddress`).
      allowedOrigins: ["localhost:3000", "10.0.0.236:3000"],
    },
  },
  images: {
    // TEMPORARY (added 2026-08-30): the Vercel account hit 100% of its
    // free-tier Image Optimization quota (5,000 transformations/month on
    // Hobby) — past that, new/uncached image sizes fail with a 402 error
    // instead of loading. `unoptimized: true` makes next/image serve the
    // original file straight from Supabase Storage instead of asking
    // Vercel to resize/convert it, which stops the 402s immediately and
    // uses none of that quota going forward. Remove this once the quota
    // resets (up to 30 days from when the cap was hit) if automatic
    // resizing/WebP conversion is worth turning back on — or leave it if
    // the slightly heavier images aren't noticeable at this catalog size.
    unoptimized: true,
    // Allows next/image to optimize both the leftover Unsplash placeholder
    // photos and the real product photos uploaded through the admin panel
    // (stored in Supabase Storage's `product-images` bucket). The Supabase
    // hostname is read from the env var instead of hardcoded, so this
    // keeps working if the project ever points at a different Supabase
    // project.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      ...(supabaseHostname
        ? [
            {
              protocol: "https",
              hostname: supabaseHostname,
              pathname: "/storage/v1/object/public/**",
            },
          ]
        : []),
    ],
  },
  async redirects() {
    return [
      // A physical QR code already printed/in circulation points at this
      // exact path (hot-vitality.com/17867577079) — nothing else ever
      // links here. Redirecting it to the homepage instead of a 404 means
      // that QR code doesn't need to be reprinted.
      {
        source: "/17867577079",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
