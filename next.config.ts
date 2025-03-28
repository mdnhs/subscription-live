import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    DECRYPT_PASS: process.env.DECRYPT_PASS,
    IS_PRODUCTION: process.env.IS_PRODUCTION,
  },
};

export default nextConfig;
