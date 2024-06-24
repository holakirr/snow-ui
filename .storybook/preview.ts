import type { Preview } from "@storybook/react";

import "../src/styles/story.css";

import { withThemeByDataAttribute } from "@storybook/addon-themes";

const preview: Preview = {
	parameters: {
		chromatic: {
			modes: {
				light: { theme: "light" },
				dark: { theme: "dark" },
			},
		},
		backgrounds: {
			disable: true,
		},
		layout: "centered",
		controls: {
			matchers: {
				withThemeByDataAttribute: true,
			},
		},
	},

	decorators: [
		withThemeByDataAttribute({
			themes: {
				light: "light",
				dark: "dark",
			},
			attributeName: "data-mode",
			defaultTheme: "light",
		}),
	],

	tags: ["autodocs"],
};

export default preview;
