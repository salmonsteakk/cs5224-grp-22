import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

const usePolling = process.env.CHOKIDAR_USEPOLLING === "true";
const watchInterval = Number(process.env.CHOKIDAR_INTERVAL || 100);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    watch: {
      usePolling,
      interval: watchInterval,
    },
    proxy: {
      "/api": {
        target: "http://server:3001",
        changeOrigin: true,
      },
    },
  },
});
