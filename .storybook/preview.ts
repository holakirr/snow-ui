import type { Preview } from "@storybook/react-vite";

import "./preview.css";

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		layout: "centered",
	},

	tags: ["autodocs"],
};

export default preview;
