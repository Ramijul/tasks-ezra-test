import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  // Server configuration for faster HMR
  server: {
    port: 5173,
    host: true,
    hmr: {
      port: 5173,
      overlay: true,
    },
    // Optimize for development
    watch: {
      usePolling: false,
      interval: 100,
    },
  },

  // Build optimizations
  build: {
    target: "esnext",
    minify: "esbuild",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },

  // Development optimizations
  optimizeDeps: {
    include: ["react", "react-dom"],
    exclude: [],
  },

  // CSS optimizations
  css: {
    devSourcemap: false,
  },

  // Clear screen on restart
  clearScreen: false,
});
