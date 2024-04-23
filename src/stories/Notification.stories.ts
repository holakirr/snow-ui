import { Notification } from "@components";
import { ROLES, SIMPLE_SIZES, STATUSES_NOTIFY } from "@constants";
import { statusControl, testErrorText, testSuccessText } from "@mocks";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";

const meta = {
	title: "Base Components/Notification",
	component: Notification,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: "centered",
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ["autodocs"],
	// More on argTypes: https://storybook.js.org/docs/api/argtypes
	argTypes: {
		status: statusControl,
		size: {
			control: "radio",
			options: Object.values(SIMPLE_SIZES),
		},
	},
	// Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
	args: {
		size: SIMPLE_SIZES.sm,
	},
} satisfies Meta<typeof Notification>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicNotification: Story = {
	args: {
		status: STATUSES_NOTIFY.success,
		title: testSuccessText,
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const notification = canvas.getByRole(ROLES.notification);
		const icon = canvas.getByRole(ROLES.icon);

		expect(notification).toBeInTheDocument();
		expect(notification).toHaveTextContent(testSuccessText);
		expect(icon).toBeInTheDocument();
		expect(icon).toHaveTextContent(
			`Icon for status ${STATUSES_NOTIFY.success}`,
		);
	},
};

export const LargeNotificationError: Story = {
	args: {
		status: STATUSES_NOTIFY.error,
		title: testErrorText,
		size: SIMPLE_SIZES.lg,
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const notification = canvas.getByRole(ROLES.notification);
		const icon = canvas.getByRole(ROLES.icon);

		expect(notification).toBeInTheDocument();
		expect(notification).toHaveTextContent(testErrorText);
		expect(icon).toBeInTheDocument();
		expect(icon).toHaveTextContent(`Icon for status ${STATUSES_NOTIFY.error}`);
	},
};
