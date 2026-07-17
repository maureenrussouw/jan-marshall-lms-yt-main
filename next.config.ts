import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  images: {
    remotePatterns: [
      {
        hostname: "janmarshall-lms-yt-video.t3.storage.dev",
        protocol: "https",
      },
      {
        hostname: "lms-yt-images-bucket.t3.storage.dev",
        protocol: "https",
      },
    ],
    minimumCacheTTL: 31536000, // 1 year cache for optimized images
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  reactCompiler: true,
};

export default nextConfig;
