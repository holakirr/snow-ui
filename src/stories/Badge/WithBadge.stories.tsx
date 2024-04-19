import { Button, WithBadge } from "@components";
import { testStatus } from "@mocks";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import { BadgeWithText, BasicBadge } from "./Badge.stories";

const meta = {
	title: "Base Components/Badge/With Badge",
	component: WithBadge,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: "centered",
		controls: {
			exclude: ["children"],
		},
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ["autodocs"],
	// More on argTypes: https://storybook.js.org/docs/api/argtypes
	argTypes: {},
	// Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
	args: {
		text: "",
		children: <Button label="Button" variant="filled" />,
	},
} satisfies Meta<typeof WithBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ButtonWithBadge: Story = {
	play: (context) => {
		if (BasicBadge.play) {
			BasicBadge.play(context);
		}

		const canvas = within(context.canvasElement);
		const button = canvas.getByRole("button");
		expect(button).toBeInTheDocument();
	},
};

export const ButtonWithBadgeWithText: Story = {
	args: {
		text: testStatus,
	},
	play: (context) => {
		if (BadgeWithText.play) {
			BadgeWithText.play(context);
		}

		const canvas = within(context.canvasElement);
		const button = canvas.getByRole("button");
		expect(button).toBeInTheDocument();
	},
};
