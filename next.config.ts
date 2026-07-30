import type { NextConfig } from "next";

/**
 * `SINGLEFILE=1` switches to a static export whose markup and image URLs are
 * plain enough to inline into one portable HTML file (see
 * `tools/build-singlefile.mjs`). It writes to its own distDir so it can never
 * clobber the deployed build.
 */
const singleFile = process.env.SINGLEFILE === "1";

const nextConfig: NextConfig = {
  // The floating dev badge sits exactly where the hero wordmark lands, which
  // makes every design review screenshot misleading.
  devIndicators: false,

  ...(singleFile
    ? {
        output: "export" as const,
        distDir: ".next-singlefile",
        // The optimizer would rewrite srcs to /_next/image?url=…; the exporter
        // needs the raw /images/*.webp paths so they can be swapped for data URIs.
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
