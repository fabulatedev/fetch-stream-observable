import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        globals: true,
        environment: 'happy-dom',
        include: ['src/*.test.ts'],
        coverage: {
            provider: 'istanbul',
            reporter: ['text', 'html', 'json', 'lcov']
        },
    },
})