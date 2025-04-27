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
  register: true,
  skipWaiting: true,
});

// Export safely
export default pwaConfig(config);
