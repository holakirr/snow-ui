import { Avatar } from "@components";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import {
	colorControl,
	imgSourceControl,
	imgSrcMock,
	testInitials,
	testUserName,
} from "@utils";

const meta = {
	title: "Base Components/Avatar/Avatar",
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

export const Basic: Story = {
	args: {},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const avatar = canvas.getByRole("figure");

		// 👇 Simulate interactions with the component
		expect(avatar).toBeInTheDocument();
		expect(avatar.lastChild?.textContent).toBe(testInitials);
	},
};

export const BasicHover: Story = {
	args: {},
	parameters: {
		pseudo: {
			hover: true,
		},
		hover: true,
	},
};

export const Large: Story = {
	args: {
		size: "large",
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const avatar = canvas.getByRole("figure");

		// 👇 Simulate interactions with the component
		expect(avatar).toBeInTheDocument();
		expect(avatar.lastChild?.textContent).toBe(testInitials);
		expect(avatar).toHaveStyle("width: 64px; height: 64px;");
	},
};

export const LargeWithImg: Story = {
	args: {
		size: "large",
		img: imgSrcMock,
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const avatar = canvas.getByRole("figure");
		const avatarImg = avatar.lastChild as HTMLImageElement;

		// 👇 Simulate interactions with the component
		expect(avatar).toBeInTheDocument();
		expect(avatarImg.getAttribute("alt")).toContain(testUserName);
		expect(avatarImg.getAttribute("src")).toBe(imgSrcMock);
	},
};
