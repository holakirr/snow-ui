import type { Config } from "tailwindcss";
import { COLOR_SCHEME } from "./src/consts";

const config: Config = {
	content: ["./src/**/*.{js,ts,jsx,tsx}"],
	darkMode: [
		"variant",
		[
			'@media (prefers-color-scheme: dark) { &:not(.[data-mode="light"] *) }',
			'&:is([data-mode="dark"] *)',
		],
	],
	theme: {
		extend: {
			borderWidth: {
				1: "1px",
			},
			colors: COLOR_SCHEME,
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-conic":
					"conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
			},
			animation: {
				loaderB: "loaderB 1s infinite",
			},
		},
	},
	plugins: [],
};

export default config;
