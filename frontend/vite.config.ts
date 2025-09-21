import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [reactRouter()],
  server: {
    proxy: {
      // Proxy requests from the frontend starting with /api
      '/static': {
        // Target your backend server
        target: 'http://localhost:3000',
        // 'changeOrigin' rewrites the Host header for the backend
        changeOrigin: true,
        // 'rewrite' is a common and useful step
        // It removes the '/api' prefix before forwarding to the target
        //rewrite: (path) => path.replace(/^\/express/, ''),
      },
    },
  },
});
