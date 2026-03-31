import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: [],
    reporters: [
      'default', // Console output
      ['json', { outputFile: path.join(__dirname, '../docs/test-result/test-results.json') }],
      ['html', { outputFile: path.join(__dirname, '../docs/test-result/index.html') }],
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: '../docs/test-result/coverage',
    },
    testTimeout: 30000, // 30 seconds for API tests
  },
});
