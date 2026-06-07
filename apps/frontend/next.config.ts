import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@agentflow/shared-types"]
}

export default nextConfig
