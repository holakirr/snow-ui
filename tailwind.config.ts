import type { Config } from "tailwindcss";
import { COLOR_SCHEME } from "./src/constants";

const config: Config = {
	content: ["./src/**/*.{js,ts,jsx,tsx}", "./stories/**/*.{js,ts,jsx,tsx}"],
	darkMode: [
		"variant",
		[
			'@media (prefers-color-scheme: dark) { &:not(.[data-mode="light"] *) }',
			'&:is([data-mode="dark"] *)',
		],
	],
	theme: {
		extend: {
			colors: COLOR_SCHEME,
			animation: {
				loaderB: "loaderB 1s infinite",
			},
		},
	},
	plugins: [],
};

export default config;
