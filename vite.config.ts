import { defineConfig } from 'vite';
import { resolve } from 'path';

// ---------------------------------------------------------------------------
// Scrap Car Runner — Vite Configuration
//
// Design decisions:
//   - Single HTML entry: index.html at repo root
//   - Logical canvas: 360×640 (portrait) — all scaling done in Phaser config
//   - Editable assets: art/source/; runtime assets: public/assets/ copied by Vite
//   - No React, no UI framework
//   - Phaser 4 is bundled normally (ESM)
// ---------------------------------------------------------------------------

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, 'src'),
    },
  },

  build: {
    outDir:       'dist',
    assetsDir:    'assets',
    sourcemap:    process.env['INTERNAL_SOURCEMAPS'] === '1',
    target:       'es2022',
    rollupOptions: {
      output: {
        // Keep Phaser in its own chunk so game logic chunks stay small
        manualChunks(id) {
          if (id.includes('node_modules/phaser')) {
            return 'phaser';
          }
        },
      },
    },
  },

  server: {
    port: 8080,
    open: false,
  },

  preview: {
    port: 8081,
  },
});
