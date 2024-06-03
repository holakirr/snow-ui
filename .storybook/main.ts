import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
	stories: ["../src/**/*.stories.@(ts|tsx)"],

	addons: [
		"@chromatic-com/storybook",
		"@storybook/addon-essentials",
		"@storybook/addon-interactions",
		"@storybook/addon-links",
		"@storybook/addon-themes",
		"@storybook/theming",
	],

	framework: "@storybook/react-vite",

	typescript: {
		reactDocgen: "react-docgen-typescript",
	},

	docs: {
		autodocs: true,
	},
};

export default config;
