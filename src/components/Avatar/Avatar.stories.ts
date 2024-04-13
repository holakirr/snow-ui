import { Avatar } from "@components";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, screen } from "@storybook/test";
import { colorControl, getInitials, imgSourceControl } from "@utils";

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

export const Basic: Story = {
	args: {},
	play: async () => {
		const avatar = screen.getByText(testInitials);

		// 👇 Simulate interactions with the component
		expect(avatar).toBeInTheDocument();
		expect(avatar.tagName).toBe("SPAN");

		const avatarParent = avatar.parentElement;

		if (!avatarParent) {
			throw new Error("Avatar parent not found");
		}

		expect(avatarParent).toHaveStyle("filter: brightness(1.5);");
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
	play: () => {
		const avatar = screen.getByText(testInitials);

		// 👇 Simulate interactions with the component
		expect(avatar).toBeInTheDocument();
		expect(avatar.parentElement?.className).toContain("w-16 h-16");

		expect(avatar.parentElement).toHaveStyle("width: 64px; height: 64px;");
	},
};

const imgSrc = "https://avatar.iran.liara.run/public/38";

export const LargeWithImg: Story = {
	args: {
		size: "large",
		img: imgSrc,
	},
	play: () => {
		const avatar = screen.getByRole("img");

		// 👇 Simulate interactions with the component
		expect(avatar).toBeInTheDocument();
		expect(avatar.getAttribute("alt")).toContain(testUserName);
		expect(avatar.getAttribute("src")).toBe(imgSrc);
	},
};
