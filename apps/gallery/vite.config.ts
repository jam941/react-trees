import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: process.env['GALLERY_BASE'] ?? '/',
  plugins: [react()],
  resolve: {
    alias: {
      elkjs: 'elkjs/lib/elk.bundled.js',
    },
  },
});
