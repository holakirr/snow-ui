import type { Meta, StoryObj } from "@storybook/react";
import { FourLeafCloverIcon } from ".";

const meta = {
	title: "Design resources/Icons/FourLeafClover",
	component: FourLeafCloverIcon,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: "centered",
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ["autodocs"],
	// More on argTypes: https://storybook.js.org/docs/api/argtypes
	argTypes: {
		weight: {
			control: "radio",
			options: ["thin", "light", "regular", "bold", "fill", "duotone"],
			description: "The weight of the icon",
		},
	},
	// Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
	args: {
		size: 24,
		alt: "FourLeafClover Icon",
		weight: "regular",
		className: "fill-primary-brand",
	},
} satisfies Meta<typeof FourLeafCloverIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FourLeafCloverIconStory: Story = {
	args: {},
};
