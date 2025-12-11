import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // ✅ VERY IMPORTANT for Vercel + custom domain
  base: "/",

  // Increase chunk size warning limit (e.g., set to 1000KB)
  build: {
    chunkSizeWarningLimit: 1000, // Setting this to a higher value, e.g., 1000 KB (1MB)
  },
});
