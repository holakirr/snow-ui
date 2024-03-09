import type { Config } from "tailwindcss";

const config: Config = {
	content: ["./src/components/**/*.{js,ts,jsx,tsx}"],
	// Toggle dark-mode based on .dark class or data-mode="dark"
	darkMode: ["class", '[data-mode="dark"]'],
	theme: {
		extend: {
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-conic":
					"conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
			},
			colors: {
				primary: "#4339F2",
				secondary: "#fff",
			},
		},
	},
	plugins: [],
};

export default config;
