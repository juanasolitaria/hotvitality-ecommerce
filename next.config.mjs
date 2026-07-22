const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
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
};

export default nextConfig;
