import { StatusBadge } from "@components";
import { ROLES, STATUSES_EXPANDED } from "@constants";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import { badgeStatusControl } from "./mocks";

const testLabel = "Status";
const altIconText = `Dot icon for status badge ${testLabel}`;

const meta = {
	title: "Base Components/Badge/Status Badge",
	component: StatusBadge,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: "centered",
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ["autodocs"],
	// More on argTypes: https://storybook.js.org/docs/api/argtypes
	argTypes: {
		label: {
			control: "text",
		},
		status: badgeStatusControl,
	},
	// Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
	args: {
		withDot: false,
		label: testLabel,
		status: STATUSES_EXPANDED.default,
	},
} satisfies Meta<typeof StatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicStatusBadge: Story = {
	args: {},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const badge = canvas.getByRole(ROLES.statusBadge);

		expect(badge).toBeInTheDocument();
		expect(badge).toHaveTextContent(testLabel);
		expect(badge).toHaveClass("bg-secondary-indigoLighter text-secondary-indigoDarker");
	},
};

export const StatusBadgeWithDot: Story = {
	args: {
		withDot: true,
		status: STATUSES_EXPANDED.success,
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const badge = canvas.getByRole(ROLES.statusBadge);
		const icon = canvas.getByRole(ROLES.icon);

		expect(badge).toBeInTheDocument();
		expect(badge).toHaveTextContent(testLabel);
		expect(badge).toHaveClass("text-secondary-greenDarker");
		expect(icon).toBeInTheDocument();
		expect(icon).toHaveTextContent(altIconText);
	},
};
