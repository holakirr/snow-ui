import { AvatarName } from "@components";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import { colorControl, imgSourceControl, testUserName } from "@utils";
import {
	Basic as BasicAvatar,
	Large as LargeAvatar,
	LargeWithImg as LargeAvatarWithImg,
} from "./Avatar.stories";

const meta = {
	title: "Base Components/Avatar/Avatar Name",
	component: AvatarName,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: "centered",
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ["autodocs"],
	// More on argTypes: https://storybook.js.org/docs/api/argtypes
	argTypes: {
		img: imgSourceControl,
		color: colorControl,
	},
	// Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
	args: {
		size: "small",
		username: testUserName,
	},
} satisfies Meta<typeof AvatarName>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicAvatarName: Story = {
	args: {},
	play: (context) => {
		const canvas = within(context.canvasElement);
		if (BasicAvatar.play) {
			BasicAvatar.play(context);
		}

		const name = canvas.getByText(testUserName);
		expect(name).toBeInTheDocument();
	},
};

export const HoverBasicAvatarName: Story = {
	args: {},
	parameters: {
		pseudo: {
			hover: "div > div",
		},
	},
};

export const BigAvatarName: Story = {
	args: {
		size: "large",
	},
	...LargeAvatar,
};

export const BigAvatarNameWithImg: Story = {
	...LargeAvatarWithImg,
	play: (context) => {
		const canvas = within(context.canvasElement);
		if (LargeAvatarWithImg.play) {
			LargeAvatarWithImg.play(context);
		}

		const name = canvas.getByText(testUserName);
		expect(name).toBeInTheDocument();
	},
};
