import { StatusIcon } from "@components";
import { STATUSES } from "@consts";
import type { Meta, StoryObj } from "@storybook/react";
import { statusControl } from "@utils";

const meta = {
	title: "Design resources/Icons/StatusIcon",
	component: StatusIcon,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: "centered",
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ["autodocs"],
	// More on argTypes: https://storybook.js.org/docs/api/argtypes
	argTypes: {
		status: statusControl,
	},
	// Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
	args: {
		size: 24,
	},
} satisfies Meta<typeof StatusIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const StatusIconStory: Story = {
	args: {
		status: STATUSES.success,
	},
};
