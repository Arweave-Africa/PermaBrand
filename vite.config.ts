import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  base:"/",
  plugins: [react(), tailwindcss(), nodePolyfills()],
  resolve: {
    alias: {
      buffer: path.resolve(
        __dirname,
        'node_modules/vite-plugin-node-polyfills/shims/buffer',
      ),
      'buffer/': path.resolve(
        __dirname,
        'node_modules/vite-plugin-node-polyfills/shims/buffer',
      ),
    },
  }
});
