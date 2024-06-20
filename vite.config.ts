import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
	plugins: [
		react(),
		dts({
			exclude: ["stories/**/*", "tests/**/*"],
		}),
	],
	build: {
		lib: {
			entry: "src/index.ts",
			name: "holakirr-snow-ui",
			fileName: "index",
		},
		rollupOptions: {
			external: ["react", "react-dom", "react-jsx-runtime"],
			output: {
				globals: {
					react: "React",
					"react-dom": "ReactDOM",
				},
			},
		},
	},
});
