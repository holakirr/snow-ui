import { Tag } from "@components";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "@storybook/test";

const testLabel = "Tag";
const dotIconTtitle = `Dot icon for tag ${testLabel}`;
const closeIconTitle = `Close icon for tag ${testLabel}`;
const closeHandler = fn();

const meta = {
	title: "Base Components/Tag",
	component: Tag,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: "centered",
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ["autodocs"],
	// More on argTypes: https://storybook.js.org/docs/api/argtypes
	argTypes: {},
	// Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
	args: {
		label: testLabel,
		withDot: false,
	},
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicTag: Story = {
	args: {},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const tag = canvas.getByRole("article");

		expect(tag).toBeInTheDocument();
		expect(tag).toHaveTextContent(testLabel);
	},
};

export const TagWithDot: Story = {
	args: {
		withDot: true,
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const dot = canvas.getByTitle(dotIconTtitle).parentElement;

		expect(dot).toBeInTheDocument();
	},
};

export const TagWithClose: Story = {
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

export const TagWithDotAndClose: Story = {
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
