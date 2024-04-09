import { withoutVitePlugins } from "@storybook/builder-vite";
import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
	stories: ["../src/**/*.stories.@(ts|tsx)"],
	addons: [
		"@chromatic-com/storybook",
		"@storybook/addon-coverage",
		"@storybook/addon-essentials",
		"@storybook/addon-interactions",
		"@storybook/addon-links",
		"@storybook/addon-themes",
		"@storybook/theming",
	],
	framework: {
		name: "@storybook/react-vite",
		options: {},
	},
	docs: {
		autodocs: "tag",
	},
	viteFinal: async (config) => ({
		...config,
		plugins: await withoutVitePlugins(config.plugins, ["vite:dts"]),
	}),
};

export default config;
