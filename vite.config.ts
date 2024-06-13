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

export default defineConfig({
	plugins: plugins,
	build: {
		target: "esnext",
		minify: true,
		lib: {
			entry: resolve(__dirname, "src/index.ts"),
			fileName: "index",
			formats: ["es", "cjs"],
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
