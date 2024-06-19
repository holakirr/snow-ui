import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
	plugins: [
		react(),
		dts({
			include: ["src/**/*.ts", "src/**/*.tsx"], // Adjust as necessary
		}),
	],
	build: {
		lib: {
			entry: "src/index.ts",
			name: "holakirr-snow-ui",
			fileName: (format) => `index.${format}.js`,
			formats: ["es", "cjs"], // Generate both ESM and CJS modules
		},
		terserOptions: {
			format: {
				comments: false, // Remove comments
			},
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
