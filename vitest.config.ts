/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: './src/test/setup.ts',
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
			include: ['src/components/**/*.tsx'],
			exclude: ['**/*.test.tsx', '**/*.stories.tsx', '**/*.spec.tsx'],
		},
	},
})
