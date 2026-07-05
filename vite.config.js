import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        eldenRing: resolve(__dirname, 'elden-ring-guide.html'),
        scheduleOne: resolve(__dirname, 'schedule-1-guide.html'),
      },
    },
  },
});
