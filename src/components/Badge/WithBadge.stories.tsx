import type { Meta, StoryObj } from "@storybook/react";
import { WithBadge } from ".";
import { Button } from "..";

const meta = {
	title: "Base Components/Components/With Badge",
	component: WithBadge,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: "centered",
		controls: {
			exclude: ["children"],
		},
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ["autodocs"],
	// More on argTypes: https://storybook.js.org/docs/api/argtypes
	argTypes: {},
	// Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
	args: {
		text: "",
		children: <Button label="Button" variant="filled" />,
	},
} satisfies Meta<typeof WithBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ButtonWithBadge: Story = {};

export const ButtonWithBadgeWithText: Story = {
	args: {
		text: "12",
	},
};
