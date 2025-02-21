import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      path: "path-browserify",
    },
  },
  optimizeDeps: {
    include: [
      "react-frame-component",
      "styled-components",
      "lodash",
      "prop-types",
    ],
  },
});
