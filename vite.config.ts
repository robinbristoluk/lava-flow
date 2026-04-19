import { resolve } from 'node:path'

import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      fileName: 'index',
      formats: ['es'],
      name: 'LavaFlow',
    },
    rollupOptions: {
      external: ['lit'],
    },
    sourcemap: true,
  },
})
