import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import { Card, ROLES, Text } from "../../src";
import { testText } from "../mocks";

const meta = {
	title: "Base Components/Card",
	component: Card,
	parameters: {
		controls: {
			exclude: ["children"],
		},
	},
	args: {
		children: <Text className="text-black-100">{testText}</Text>,
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
				<Text className="text-black-100">{testText}</Text>
				<Text className="text-black-100">{testText}</Text>
				<Text className="text-black-100">{testText}</Text>
				<Text className="text-black-100">{testText}</Text>
			</>
		),
	},
};
