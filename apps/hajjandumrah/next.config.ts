import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Shared packages ship TypeScript source; Next.js compiles them.
  transpilePackages: ["@manziltech/ui", "@manziltech/design-tokens"],
};

export default nextConfig;
