import type { StorybookConfig } from "@storybook/react-vite";
import path from "path";
import tsconfigPaths from "vite-tsconfig-paths";

const config: StorybookConfig = {
	stories: ["../src/**/*.story.@(js|jsx|ts|tsx)"],
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
	viteFinal: (config) => {
		// modify the Vite config here
		if (config.plugins) {
			config.plugins.push(
				tsconfigPaths({
					projects: [path.resolve(path.dirname(__dirname), "tsconfig.json")],
				}),
			);
		}

		return config;
	},
};

export default config;
