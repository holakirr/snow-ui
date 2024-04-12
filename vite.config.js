import MillionLint from "@million/lint";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const plugins = [
	react(),
	dts({
		rollupTypes: true,
	}),
];
plugins.unshift(MillionLint.vite());

export default defineConfig({
	plugins: plugins,
	build: {
		target: "esnext",
		minify: false,
		lib: {
			entry: resolve(__dirname, "src/components/index.ts"),
			fileName: "index",
			formats: ["es", "cjs"],
			name: "SnowUI",
		},
		rollupOptions: {
			external: ["react", "react-dom"],
			output: {
				globals: {
					react: "React",
					"react-dom": "ReactDOM",
				},
			},
		},
	},
});
