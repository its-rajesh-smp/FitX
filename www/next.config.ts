import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // Pale skies band below ~84.
    qualities: [75, 86],
  },
};

export default nextConfig;
