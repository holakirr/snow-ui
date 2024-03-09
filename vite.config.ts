import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	plugins: [
		react(),
		tsconfigPaths(),
		checker({
			typescript: true,
			eslint: {
				lintCommand: 'biome "./src/**/*.{ts,tsx}"',
			},
		}),
		dts({ rollupTypes: true }), // Output .d.ts files
	],
	build: {
		lib: {
			entry: "./src/index.ts",
			formats: ["es"],
			fileName: "index",
			name: "ReactComponents",
		},
		rollupOptions: {
			external: ["react", "react-dom"],
		},
		chunkSizeWarningLimit: 1000,
	},
});
