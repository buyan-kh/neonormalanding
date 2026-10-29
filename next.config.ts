import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  agentRules: false,
  async redirects() {
    return [
      { source: "/newui", destination: "/", permanent: true },
      { source: "/newui/:path*", destination: "/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
