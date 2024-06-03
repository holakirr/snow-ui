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
	resolve: {
		alias: {
			"@components": resolve(__dirname, "src/components"),
			"@constants": resolve(__dirname, "src/constants"),
			"@mocks": resolve(__dirname, "src/stories/mocks"),
			"@styles": resolve(__dirname, "src/styles"),
			"@helpers": resolve(__dirname, "src/helpers"),
			"@hooks": resolve(__dirname, "src/hooks"),
			"@types": resolve(__dirname, "src/types"),
			"@widgets": resolve(__dirname, "src/widgets"),
		},
	},
	build: {
		target: "esnext",
		minify: true,
		lib: {
			entry: resolve(__dirname, "src/index.ts"),
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
