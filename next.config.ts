import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.PAGES ? "/fukui-kanko-people-flow-visualization" : "",
  assetPrefix: process.env.PAGES ? "/fukui-kanko-people-flow-visualization" : "",
  trailingSlash: true,
};

export default nextConfig;
