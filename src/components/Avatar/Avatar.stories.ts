import type { Meta, StoryObj } from "@storybook/react";
import { Avatar } from ".";

const meta = {
	title: "Base Components/Components/Avatar",
	component: Avatar,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: "centered",
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ["autodocs"],
	// More on argTypes: https://storybook.js.org/docs/api/argtypes
	argTypes: {
		img: {
			control: "radio",
			options: [
				"https://avatar.iran.liara.run/public/38",
				"https://avatar.iran.liara.run/public/61",
				"https://avatar.iran.liara.run/public/job/chef/female",
				null,
			],
		},
	},
	// Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
	args: {
		small: true,
		username: "John Doe",
	},
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicAvatar: Story = {
	args: {},
};

export const BigAvatar: Story = {
	args: {
		small: false,
	},
};

export const BigAvatarWithImg: Story = {
	args: {
		small: false,
		img: "https://avatar.iran.liara.run/public/38",
	},
};
