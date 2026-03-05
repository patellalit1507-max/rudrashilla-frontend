import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  // VITE_BASE_PATH is injected by CI (e.g. /rudrashilla-frontend/).
  // Falls back to '/' for local dev.
  base: process.env.VITE_BASE_PATH ?? '/',
  plugins: [tailwindcss(), react(), cloudflare()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
})