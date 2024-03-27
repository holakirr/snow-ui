import type { Meta, StoryObj } from "@storybook/react";
import { Tag } from ".";

const meta = {
	title: "Base Components/Components/Tag",
	component: Tag,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: "centered",
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ["autodocs"],
	// More on argTypes: https://storybook.js.org/docs/api/argtypes
	argTypes: {},
	// Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
	args: {
		label: "Tag",
		withDot: false,
	},
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicTag: Story = {
	args: {},
};

export const TagWithDot: Story = {
	args: {
		withDot: true,
	},
};

export const TagWithClose: Story = {
	args: {
		onClose: () => {},
	},
};

export const TagWithDotAndClose: Story = {
	args: {
		withDot: true,
		onClose: () => {},
	},
};
