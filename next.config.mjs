/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allows next/image to optimize the Unsplash stock photos we use as
    // placeholder product images during this UI-only phase. Once real
    // product photos are uploaded to Cloudinary, add that hostname here too.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
