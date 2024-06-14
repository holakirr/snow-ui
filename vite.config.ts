import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
	plugins: [
		react(),
		dts({
			// Укажите пути к компонентам или корневую директорию, если нужно
		}),
	],
	optimizeDeps: {
		include: ["react", "react-dom"],
	},
	build: {
		lib: {
			entry: "src/index.ts",
			name: "holakirr-snow-ui",
			fileName: (format) => `index.${format}.js`,
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
