import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const basePath = isProd ? "/sf-pharma-360" : "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  trailingSlash: true,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  // Hide the Next dev "N" badge — the bottom-left corner is now ours
  // (preview cluster lives there). Prod export never shows it anyway.
  devIndicators: false,
};

export default nextConfig;
