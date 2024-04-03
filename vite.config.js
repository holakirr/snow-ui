import MillionLint from "@million/lint";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { peerDependencies } from "./package.json";

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
			fileName: "snow-ui",
			name: "SnowUI",
		},
		rollupOptions: {
			external: ["react/jsx-runtime", ...Object.keys(peerDependencies)],
		},
	},
});
