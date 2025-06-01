// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // Assuming this is needed

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Keep this if you use it
  ],
  build: {
    outDir: 'dist',
  },
});