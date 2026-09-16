import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import { imagetools } from "vite-imagetools";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tanstackStart({
      prerender: {
        enabled: true,
        concurrency: 1,
        crawlLinks: true,
        failOnError: true,
        filter: ({ path: routePath }) => !routePath.includes("#"),
        retryCount: 2,
        retryDelay: 250,
      },
    }),
    react(),
    tailwindcss(),
    imagetools({
      defaultDirectives: new URLSearchParams({
        format: "webp",
      }),
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
