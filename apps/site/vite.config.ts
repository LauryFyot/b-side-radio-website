import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "./",
  server: {
    proxy: {
      "/api/radio/azuracast": {
        target: "http://51.91.124.240",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/radio\/azuracast/, ""),
      },
      "/api/radio/legacy": {
        target: "http://91.134.242.174:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/radio\/legacy/, ""),
      },
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@shared": fileURLToPath(new URL("../../shared", import.meta.url)),
    },
  },
});
