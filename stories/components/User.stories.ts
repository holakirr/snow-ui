import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import { SIZES, User } from "../../src";
import { colorControl, imgSourceControl, testUserName } from "../mocks";
import {
	Basic as BasicAvatar,
	Default as DefaultAvatar,
	Large as LargeAvatar,
	LargeWithImg as LargeAvatarWithImg,
} from "./Avatar/Avatar.stories";

const meta = {
	title: "Base Components/User",
	component: User,
	argTypes: {
		src: imgSourceControl,
		color: colorControl,
	},
	args: {
		size: SIZES.sm,
		name: testUserName,
	},
} satisfies Meta<typeof User>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicUser: Story = {
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

export const DefaultUser: Story = {
	args: {
		showFallback: true,
	},
	play: (context) => {
		const canvas = within(context.canvasElement);
		if (DefaultAvatar.play) {
			DefaultAvatar.play(context);
		}

		const name = canvas.getByText(testUserName);
		expect(name).toBeInTheDocument();
	},
};

export const BigUser: Story = {
	args: {
		size: SIZES.lg,
	},
	...LargeAvatar,
};

export const BigUserWithImg: Story = {
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
