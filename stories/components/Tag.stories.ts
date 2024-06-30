import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "@storybook/test";
import { ROLES, Tag } from "../../src";

const testLabel = "Tag";
const dotIconTtitle = `Dot icon for tag ${testLabel}`;
const closeIconTitle = `Close icon for tag ${testLabel}`;
const closeHandler = fn();

const meta = {
	title: "Base Components/Tag",
	component: Tag,
	args: {
		label: testLabel,
		withDot: false,
	},
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	args: {},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const tag = canvas.getByRole(ROLES.listitem);

		expect(tag).toBeInTheDocument();
		expect(tag).toHaveTextContent(testLabel);
	},
};

export const WithDot: Story = {
	args: {
		withDot: true,
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const dot = canvas.getByTitle(dotIconTtitle).parentElement;

		expect(dot).toBeInTheDocument();
	},
};

export const WithClose: Story = {
	args: {
		onClose: closeHandler,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const close = canvas.getByTitle(closeIconTitle).parentElement;

		expect(close).toBeInTheDocument();

		await userEvent.click(close as HTMLElement);

		expect(closeHandler).toHaveBeenCalled();
	},
};

export const WithDotAndClose: Story = {
	args: {
		withDot: true,
		onClose: () => {},
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const dot = canvas.getByTitle(dotIconTtitle);
		const close = canvas.getByTitle(closeIconTitle);

		expect(dot).toBeInTheDocument();
		expect(close).toBeInTheDocument();
	},
};
