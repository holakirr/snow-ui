import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import { Badge, Button } from "../../src/components";
import { ROLES } from "../../src/constants";
import { testStatus } from "../mocks";

const meta = {
	title: "Base Components/Badge",
	component: Badge,
	parameters: {
		controls: {
			exclude: ["children"],
		},
	},
	args: {
		content: "",
		children: <Button label="Button" variant="filled" />,
	},
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	args: {
		children: null,
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const badge = canvas.getByRole(ROLES.status);

		expect(badge).toBeInTheDocument();
	},
};

export const BadgeWithText: Story = {
	args: {
		content: testStatus,
		children: null,
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const badge = canvas.getByRole(ROLES.status);

		expect(badge).toBeInTheDocument();
		expect(badge).toHaveTextContent(testStatus);
	},
};

export const WithButton: Story = {
	play: (context) => {
		const canvas = within(context.canvasElement);
		const button = canvas.getByRole(ROLES.button);
		const badge = canvas.getByRole(ROLES.status);

		expect(button).toBeInTheDocument();
		expect(badge).toBeInTheDocument();
	},
};

export const WithButtonAndContent: Story = {
	args: {
		content: testStatus,
	},
	play: (context) => {
		const canvas = within(context.canvasElement);
		const button = canvas.getByRole(ROLES.button);
		const badge = canvas.getByRole(ROLES.status);

		expect(button).toBeInTheDocument();
		expect(badge).toBeInTheDocument();
	},
};
