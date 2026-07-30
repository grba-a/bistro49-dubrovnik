import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The floating dev badge sits exactly where the hero wordmark lands, which
  // makes every design review screenshot misleading.
  devIndicators: false,
};

export default nextConfig;
