import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== 'production';

const nextConfig: NextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '/yi',
  assetPrefix: isDev ? '/dev/yi' : '/yi',
  trailingSlash: true,
  allowedDevOrigins: ['8.136.25.169'],
};

export default nextConfig;
