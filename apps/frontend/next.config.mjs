/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  transpilePackages: ["@agentflow/shared-types"],
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true }
}

export default nextConfig
