import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import { Avatar } from ".";
import { colorControl, imgSourceControl } from "../../utils";
import { getInitials } from "./getInitials";

const testUserName = "John Doe";
const testInitials = getInitials(testUserName);

const meta = {
	title: "Base Components/Avatar",
	component: Avatar,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: "centered",
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ["autodocs"],
	// More on argTypes: https://storybook.js.org/docs/api/argtypes
	argTypes: {
		color: colorControl,
		img: imgSourceControl,
	},
	// Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
	args: {
		size: "small",
		username: testUserName,
		color: "orange",
	},
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicAvatar: Story = {
	args: {},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const avatar = canvas.getByText(testInitials);

		// 👇 Simulate interactions with the component
		expect(avatar).toBeInTheDocument();
		expect(avatar.tagName).toBe("SPAN");
	},
};

export const LargeAvatar: Story = {
	args: {
		size: "large",
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const avatar = canvas.getByText(testInitials);

		// 👇 Simulate interactions with the component
		expect(avatar).toBeInTheDocument();
		expect(avatar.parentElement?.className).toContain("w-16 h-16");
	},
};

export const LargeAvatarWithImg: Story = {
	args: {
		size: "large",
		img: "https://avatar.iran.liara.run/public/38",
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const avatar = canvas.getByRole("img");

		// 👇 Simulate interactions with the component
		expect(avatar).toBeInTheDocument();
		expect(avatar.getAttribute("alt")).toContain(testUserName);
	},
};
