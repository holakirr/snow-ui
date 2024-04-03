import type { Meta, StoryObj } from "@storybook/react";
import { FourPointedStarIcon } from "..";

const meta = {
	title: "Design resources/Icons/FourPointedStar",
	component: FourPointedStarIcon,
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
			options: ["regular"],
			description: "The weight of the icon",
		},
	},
	// Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
	args: {
		size: 24,
		alt: "FourPointedStar Icon",
		weight: "regular",
		className: "fill-primary-brand",
	},
} satisfies Meta<typeof FourPointedStarIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FourPointedStarIconStory: Story = {
	args: {},
};
