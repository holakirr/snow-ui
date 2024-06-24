import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import { Avatar, ROLES, SIZES } from "../../../src";
import {
	colorControl,
	imgSourceControl,
	imgSrcMock,
	testInitials,
	testUserName,
} from "../../mocks";

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
		src: imgSourceControl,
	},
	// Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
	args: {
		size: SIZES.sm,
		name: testUserName,
		color: "orange",
	},
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	args: {},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const avatar = canvas.getByRole(ROLES.avatar);

		expect(avatar).toBeInTheDocument();
		expect(avatar.lastChild?.textContent).toBe(testInitials);
	},
};

export const Default: Story = {
	args: {
		showFallback: true,
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const avatar = canvas.getByRole(ROLES.avatar);
		const userIcon = avatar.lastChild as SVGElement;

		expect(avatar).toBeInTheDocument();
		expect(userIcon.getAttribute("aria-label")).toContain("Default user icon");
	},
};

export const Medium: Story = {
	args: {
		size: SIZES.md,
		src: imgSrcMock,
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const avatar = canvas.getByRole(ROLES.avatar);

		expect(avatar).toBeInTheDocument();
	},
};

export const Large: Story = {
	args: {
		size: SIZES.lg,
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const avatar = canvas.getByRole(ROLES.avatar);

		expect(avatar).toBeInTheDocument();
		expect(avatar.lastChild?.textContent).toBe(testInitials);
		expect(avatar).toHaveStyle("width: 64px; height: 64px;");
	},
};

export const LargeWithImg: Story = {
	args: {
		size: SIZES.lg,
		src: imgSrcMock,
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const avatar = canvas.getByRole(ROLES.avatar);
		const avatarImg = avatar.lastChild as HTMLImageElement;

		expect(avatar).toBeInTheDocument();
		expect(avatarImg.getAttribute("alt")).toContain(testUserName);
		expect(avatarImg.getAttribute("src")).toBe(imgSrcMock);
	},
};
