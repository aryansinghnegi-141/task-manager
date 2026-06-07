// Import the Vite defineConfig helper for IDE autocomplete and type safety
import { defineConfig } from "vite";

// Import the official React plugin — enables JSX transform and React Fast Refresh
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  // Register plugins used during development and build
  plugins: [
    react(), // enables JSX fast refresh in dev, optimised JSX in prod builds
  ],

  // Development server configuration
  server: {
    port: 5173, // default Vite port — matches the CORS allow-list in the backend .env
    // Proxy API requests to the Express backend to avoid CORS issues during development
    // Any request to /api/* will be forwarded to http://localhost:3001
    proxy: {
      "/api": {
        target: "http://localhost:3001", // backend server address
        changeOrigin: true,              // rewrites the Host header to match target
      },
    },
  },

  // Test configuration for Vitest (Vite-native test runner)
  test: {
    environment: "jsdom",   // simulate a browser DOM for React component tests
    globals: true,          // expose describe/it/expect globally (no imports needed)
    setupFiles: "./src/test/setup.js", // run this file before every test suite
  },
});
