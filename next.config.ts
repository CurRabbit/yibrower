import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: '/yi',
  assetPrefix: '/yi',
  trailingSlash: true,
  allowedDevOrigins: ['8.136.25.169'],
};

export default nextConfig;
