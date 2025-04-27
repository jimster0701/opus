/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";
import withPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const config = {
  // your config
};

const pwaConfig = withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  // Add this to prevent TypeScript from processing service worker files
  register: true,
  skipWaiting: true,
  // This is important for your case
  buildExcludes: [/middleware-manifest\.json$/, /sw\.js$/, /worker-*.js$/],
});

// Export safely
export default pwaConfig(config);
