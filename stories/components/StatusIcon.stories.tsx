import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import { ROLES, STATUSES, StatusIcon } from "../../src";
import { statusControl } from "../mocks";

const altText = "Icon for status ";

const meta = {
	title: "Design resources/Icons/StatusIcon",
	component: StatusIcon,
	argTypes: {
		status: statusControl,
	},
	args: {
		size: 24,
	},
} satisfies Meta<typeof StatusIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SuccessStatusIcon: Story = {
	args: {
		status: STATUSES.success,
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const icon = canvas.getByRole(ROLES.icon);

		expect(icon).toBeInTheDocument();
		expect(icon).toHaveTextContent(altText + STATUSES.success);
	},
};

export const ProgressStatusIcon: Story = {
	args: {
		status: STATUSES.progress,
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const icon = canvas.getByRole(ROLES.icon);

		expect(icon).toBeInTheDocument();
		expect(icon).toHaveTextContent(altText + STATUSES.progress);
	},
};

export const ErrorStatusIcon: Story = {
	args: {
		status: STATUSES.error,
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const icon = canvas.getByRole(ROLES.icon);

		expect(icon).toBeInTheDocument();
		expect(icon).toHaveTextContent(altText + STATUSES.error);
	},
};
