// cypress.config.ts
import { defineConfig } from "cypress";
import * as dotenv from "dotenv";

// Load the test environment variables (assumes .env.test is in project root)
dotenv.config({ path: ".env.test" });

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {
      // Pass environment variables to Cypress
      config.env = {
        ...config.env,
        NODE_ENV: process.env.NODE_ENV || "test",
        CYPRESS: process.env.CYPRESS || "true",
        NEXTAUTH_URL: process.env.NEXTAUTH_URL || "http://localhost:3000",
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        // Add any other env vars your app needs
      };

      return config;
    },
    supportFile: "cypress/support/e2e.ts",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
  },
});
