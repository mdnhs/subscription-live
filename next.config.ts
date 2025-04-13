import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    staleTimes: {
      dynamic: 30, // Cache dynamic pages for 30 seconds
      static: 180, // Cache static pages for 3 minutes
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
  env: {
    DECRYPT_PASS: process.env.DECRYPT_PASS,
    AUTH_SECRET: process.env.AUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXT_PUBLIC_REST_API_KEY: process.env.NEXT_PUBLIC_REST_API_KEY,
    NEXT_PUBLIC_REST_API_URL: process.env.NEXT_PUBLIC_REST_API_URL,
    NEXT_PUBLIC_STRIPE_PUBLISHER_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHER_KEY,
    NEXT_PUBLIC_STRIPE_SECRET_KEY: process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY,
    STORE_ID: process.env.STORE_ID,
    STORE_PASSWORD: process.env.STORE_PASSWORD,
  },
};

export default nextConfig;
