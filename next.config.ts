import type { NextConfig } from "next";
import { readFileSync } from "fs";
import { join } from "path";

// @ts-expect-error - next-pwa doesn't have TypeScript definitions
import withPWA from "next-pwa";

// Read version from package.json
const packageJson = JSON.parse(
  readFileSync(join(process.cwd(), "package.json"), "utf8"),
);

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Add empty turbopack config to silence warning
  turbopack: {},
  // Configure for static export (GitHub Pages)
  output: "export",
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  // No basePath needed with custom domain (hourkeep.app)
  // Inject version as environment variable
  env: {
    NEXT_PUBLIC_APP_VERSION: packageJson.version,
  },
};

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
})(nextConfig);
