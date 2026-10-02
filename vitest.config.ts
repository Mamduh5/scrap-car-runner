import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

// ---------------------------------------------------------------------------
// Vitest configuration
//
// Test scope: pure domain/logic modules only (no Phaser, no DOM rendering)
//   - src/domain/**
//   - src/services/**
//   - src/data/**
//
// Phaser scenes and UI components are NOT unit-tested here.
// They are integration-tested manually or via future E2E tooling.
// ---------------------------------------------------------------------------

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, 'src'),
    },
  },

  test: {
    environment: 'node',          // Pure logic — no DOM needed for domain tests
    include: [
      'src/domain/**/*.test.ts',
      'src/services/**/*.test.ts',
      'src/data/**/*.test.ts',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary'],
      include: [
        'src/domain/**/*.ts',
        'src/services/**/*.ts',
        'src/data/**/*.ts',
      ],
      exclude: ['**/*.test.ts', '**/*.spec.ts'],
    },
  },
});
