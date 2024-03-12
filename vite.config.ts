import react from "@vitejs/plugin-react-swc";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

import { peerDependencies } from "./package.json";

export default defineConfig({
	plugins: [react(), dts({ rollupTypes: true })],
	build: {
		target: "esnext",
		minify: false,
		lib: {
			entry: resolve(__dirname, "src/components/index.ts"),
			fileName: "kage-ui",
			name: "KageUI",
		},
		rollupOptions: {
			external: ["react/jsx-runtime", ...Object.keys(peerDependencies)],
		},
	},
});
