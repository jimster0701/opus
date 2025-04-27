/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";
import withPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const config = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**", // Allow all paths under res.cloudinary.com
      },
    ],
  },
};
const finalConfig =
  process.env.NODE_ENV === "development"
    ? config
    : withPWA(
        {
          dest: "public",
          register: true,
          skipWaiting: true,
        },
        config
      );

// Export safely
export default finalConfig;
