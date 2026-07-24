import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
    }),
  ],
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('react-dom') || id.includes('/react/')) return 'vendor';
          if (id.includes('@mui/material') || id.includes('@mui/icons-material') || id.includes('@mui/system')) return 'mui';
          if (id.includes('@emotion/react') || id.includes('@emotion/styled')) return 'emotion';
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
