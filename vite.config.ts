import { defineConfig } from "vite";
import dyadComponentTagger from "@dyad-sh/react-vite-component-tagger";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      "/api": {
        target: "https://pb2.mgtserver.es",
        changeOrigin: true,
      },
    },
  },
  plugins: [
    dyadComponentTagger(),
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "linkflow-icon.svg"],
      manifest: {
        short_name: "LinkFlow",
        name: "LinkFlow - Tu Bio Link",
        description: "Crea tu perfil de enlaces personalizado en segundos.",
        lang: "es",
        start_url: ".",
        display: "standalone",
        theme_color: "#5D3FD3",
        background_color: "#ffffff",
        icons: [
          {
            src: "/linkflow-icon.svg",
            sizes: "512x512",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
          {
            src: "/favicon.svg",
            sizes: "48x48",
            type: "image/svg+xml",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
