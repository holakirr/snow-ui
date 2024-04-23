import { Card, Text } from "@components";
import { ROLES } from "@constants";
import { testText } from "@mocks";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";

const meta = {
	title: "Base Components/Card",
	component: Card,
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
		children: <Text>{testText}</Text>,
	},
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicCard: Story = {
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const card = canvas.getByRole(ROLES.card);

		expect(card).toHaveTextContent(testText);
	},
};

export const LargeCard: Story = {
	args: {
		children: (
			<>
				<Text>{testText}</Text>
				<Text>{testText}</Text>
				<Text>{testText}</Text>
				<Text>{testText}</Text>
				<Text>{testText}</Text>
			</>
		),
	},
};
