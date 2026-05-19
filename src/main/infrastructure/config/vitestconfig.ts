import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node', // importante para backend
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['node_modules/', 'tests/'], // ajusta según tu proyecto
    },
  },
})