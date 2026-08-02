// Build statique (SPA prerendu) pour hebergement FTP classique type OVH.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  nitro: false,
  tanstackStart: {
    spa: { enabled: true },
    prerender: { enabled: true, crawlLinks: true },
    pages: [{ path: "/" }],
  },
  vite: {
    resolve: { tsconfigPaths: true },
    build: { outDir: "dist-static" },
  },
});
