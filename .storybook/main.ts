import { withoutVitePlugins } from "@storybook/builder-vite";
import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
	stories: ["../src/**/*.stories.@(js|jsx|ts|tsx)"],
	addons: [
		"@storybook/addon-links",
		"@storybook/addon-essentials",
		"@chromatic-com/storybook",
		"@storybook/addon-interactions",
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
	core: {
		builder: "@storybook/builder-vite",
	},
	viteFinal: async (config) => ({
		...config,
		plugins: await withoutVitePlugins(config.plugins, ["vite:dts"]), // skip dts plugin
	}),
};

export default config;
