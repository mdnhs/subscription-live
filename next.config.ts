import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    DECRYPT_PASS: process.env.DECRYPT_PASS,
    IS_PRODUCTION: process.env.IS_PRODUCTION,
    MONGODB_URI: process.env.MONGODB_URI,
    AUTH_SECRET: process.env.AUTH_SECRET,
  },
};

export default nextConfig;
