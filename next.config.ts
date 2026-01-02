import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  typescript: {
    ignoreBuildErrors: true,
  },
  serverExternalPackages: ["fabric"],
};

export default nextConfig;
