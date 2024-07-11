import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import { StatusBadge } from "../../src/components";
import { ROLES, SIZES, STATUSES_EXPANDED } from "../../src/constants";
import { badgeStatusControl } from "../mocks";

const testLabel = "Status";
const altIconText = `Dot icon for status badge ${testLabel}`;

const meta = {
	title: "Base Components/StatusBadge",
	component: StatusBadge,
	argTypes: {
		label: {
			control: "text",
		},
		status: badgeStatusControl,
		size: {
			control: "select",
			options: [SIZES.sm, SIZES.md],
		},
	},
	args: {
		withDot: false,
		label: testLabel,
		status: STATUSES_EXPANDED.default,
		size: SIZES.sm,
	},
} satisfies Meta<typeof StatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const badge = canvas.getByRole(ROLES.status);

		expect(badge).toBeInTheDocument();
		expect(badge).toHaveTextContent(testLabel);
		expect(badge).toHaveClass("bg-secondary-indigoLighter text-secondary-indigoDarker");
	},
};

export const WithDot: Story = {
	args: {
		withDot: true,
		status: STATUSES_EXPANDED.success,
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const badge = canvas.getByRole(ROLES.status);
		const icon = canvas.getByRole(ROLES.img);

		expect(badge).toBeInTheDocument();
		expect(badge).toHaveTextContent(testLabel);
		expect(badge).toHaveClass("text-secondary-greenDarker");
		expect(icon).toBeInTheDocument();
		expect(icon).toHaveTextContent(altIconText);
	},
};

export const MediumSize: Story = {
	args: {
		size: SIZES.md,
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const badge = canvas.getByRole(ROLES.status);

		expect(badge).toBeInTheDocument();
		expect(badge).toHaveTextContent(testLabel);
		expect(badge).toHaveClass("text-sm");
	},
};
