import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Standalone link-in-bio app. Its dependencies are resolved from the parent
// portfolio's node_modules during local iteration; run `npm install` here if
// this folder is ever extracted into its own repository.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5174,
  },
  build: {
    rollupOptions: {
      output: {
        // React only changes when React changes: keeping it in its own chunk
        // lets a copy edit reuse the cached framework instead of the whole
        // bundle.
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/scheduler')) {
            return 'react';
          }
          return undefined;
        },
      },
    },
  },
});
