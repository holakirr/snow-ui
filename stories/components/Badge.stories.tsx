import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import { Badge, Button } from "../../src/components";
import { ROLES } from "../../src/constants";
import { testStatus } from "../mocks";

const meta = {
	title: "Base Components/Badge",
	component: Badge,
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
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicBadge: Story = {
	args: {
		children: null,
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const badge = canvas.getByRole(ROLES.badge);

		expect(badge).toBeInTheDocument();
	},
};

export const BadgeWithText: Story = {
	args: {
		text: testStatus,
		children: null,
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const badge = canvas.getByRole(ROLES.badge);

		expect(badge).toBeInTheDocument();
		expect(badge).toHaveTextContent(testStatus);
	},
};

export const ButtonBadge: Story = {
	play: (context) => {
		const canvas = within(context.canvasElement);
		const button = canvas.getByRole(ROLES.button);
		const badge = canvas.getByRole(ROLES.badge);

		expect(button).toBeInTheDocument();
		expect(badge).toBeInTheDocument();
	},
};

export const ButtonBadgeWithText: Story = {
	args: {
		text: testStatus,
	},
	play: (context) => {
		const canvas = within(context.canvasElement);
		const button = canvas.getByRole(ROLES.button);
		const badge = canvas.getByRole(ROLES.badge);

		expect(button).toBeInTheDocument();
		expect(badge).toBeInTheDocument();
	},
};
