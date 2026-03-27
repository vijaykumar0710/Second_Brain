import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173, // Default Vite port
    proxy: {
      // This allows you to use /api/links instead of http://localhost:5000/api/links
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
