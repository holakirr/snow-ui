import type { Meta, StoryObj } from "@storybook/react";
import { StatusBadge } from ".";
import { badgeStatusControl } from "../../utils";

const meta = {
	title: "Base Components/Components/StatusBadge",
	component: StatusBadge,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: "centered",
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ["autodocs"],
	// More on argTypes: https://storybook.js.org/docs/api/argtypes
	argTypes: {
		label: {
			control: "text",
		},
		status: badgeStatusControl,
	},
	// Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
	args: {
		withDot: false,
		label: "Status",
		status: "default",
	},
} satisfies Meta<typeof StatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicStatusBadge: Story = {
	args: {},
};

export const StatusBadgeWithDot: Story = {
	args: {
		withDot: true,
		status: "success",
	},
};
