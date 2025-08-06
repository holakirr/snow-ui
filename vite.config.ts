import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		dts({
			// insertTypesEntry: true,
			exclude: ["src/lib/defs/**/*", "src/**/*.stories.tsx", "src/**/*.stories.ts"],
		}),
	],
	build: {
		lib: {
			entry: resolve(__dirname, "src/main.tsx"),
			name: "@holakirr/snow-ui-icons",
			formats: ["es", "umd"],
			fileName: (format) => `main.${format === "umd" ? "umd.cjs" : "js"}`,
		},
		rollupOptions: {
			external: ["react", "react-dom", "react/jsx-runtime", "@holakirr/snow-ui"],
			output: {
				globals: {
					react: "React",
					"react-dom": "ReactDOM",
					"react/jsx-runtime": "jsxRuntime",
					"@holakirr/snow-ui": "snowUi",
				},
			},
		},
	},
});
