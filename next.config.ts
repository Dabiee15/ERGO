// @ts-ignore: Suppress TS validation for this config
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// prettier-ignore

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Add your config here
  eslint: {
    // Ignores ESLint during builds (useful for deploys with dirty code)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignores type errors during build
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
