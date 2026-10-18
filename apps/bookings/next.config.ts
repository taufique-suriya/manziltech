import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for Azure Static Web Apps (decision 0009): 'next build' writes plain files to 'out/'.
  output: "export",
  // Pages become folders with index.html ('/about/'), which static hosts serve without rewrites.
  trailingSlash: true,
  // Shared packages ship TypeScript source; Next.js compiles them.
  transpilePackages: ["@manziltech/ui", "@manziltech/design-tokens"],
};

export default nextConfig;
