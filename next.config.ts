import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "8mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "tttupvhitpoaslnezxma.supabase.co",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
