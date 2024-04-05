import type { Meta, StoryObj } from "@storybook/react";
import { Notification } from ".";
import { statusControl } from "../../utils";

const meta = {
	title: "Base Components/Components/Notification",
	component: Notification,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: "centered",
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ["autodocs"],
	// More on argTypes: https://storybook.js.org/docs/api/argtypes
	argTypes: {
		status: statusControl,
		size: {
			control: "radio",
			options: ["sm", "lg"],
		},
	},
	// Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
	args: {},
} satisfies Meta<typeof Notification>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicNotification: Story = {
	args: {
		status: "success",
		title: "Success",
	},
};

export const LargeNotificationError: Story = {
	args: {
		status: "error",
		title: "Error",
		size: "lg",
	},
};
