import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import { Notification, ROLES, SIMPLE_SIZES, STATUSES_NOTIFY } from "../../src";
import { statusControl, testErrorText, testSuccessText } from "../mocks";

const meta = {
	title: "Base Components/Notification",
	component: Notification,
	argTypes: {
		status: statusControl,
		size: {
			control: "radio",
			options: Object.values(SIMPLE_SIZES),
		},
	},
	args: {
		size: SIMPLE_SIZES.sm,
	},
} satisfies Meta<typeof Notification>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	args: {
		status: STATUSES_NOTIFY.success,
		title: testSuccessText,
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const notification = canvas.getByRole(ROLES.alert);
		const icon = canvas.getByRole(ROLES.img);

		expect(notification).toBeInTheDocument();
		expect(notification).toHaveTextContent(testSuccessText);
		expect(icon).toBeInTheDocument();
		expect(icon).toHaveTextContent(`Icon for status ${STATUSES_NOTIFY.success}`);
	},
};

export const LargeWithError: Story = {
	args: {
		status: STATUSES_NOTIFY.error,
		title: testErrorText,
		size: SIMPLE_SIZES.lg,
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const notification = canvas.getByRole(ROLES.alert);
		const icon = canvas.getByRole(ROLES.img);

		expect(notification).toBeInTheDocument();
		expect(notification).toHaveTextContent(testErrorText);
		expect(icon).toBeInTheDocument();
		expect(icon).toHaveTextContent(`Icon for status ${STATUSES_NOTIFY.error}`);
	},
};
