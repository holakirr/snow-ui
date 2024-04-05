import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from ".";

const meta = {
	title: "Base Components/Badge",
	component: Badge,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: "centered",
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ["autodocs"],
	// More on argTypes: https://storybook.js.org/docs/api/argtypes
	argTypes: {
		text: {
			control: "text",
		},
	},
	// Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
	args: {},
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicBadge: Story = {
	args: {},
};

export const BadgeWithText: Story = {
	args: {
		text: "12",
	},
};
