import { ArrowLineDownIcon, Button, FourLeafCloverIcon } from "@components";
import { SIZES } from "@consts";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, within } from "@storybook/test";
import { buttonVariantControl, iconControl, sizeControl } from "./mocks";

const clickHandler = fn();

const meta = {
	title: "Base Components/Button",
	component: Button,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: "centered",
		controls: {
			exclude: ["onClick"],
		},
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ["autodocs"],
	// More on argTypes: https://storybook.js.org/docs/api/argtypes
	argTypes: {
		leftIcon: iconControl,
		rightIcon: iconControl,
		variant: buttonVariantControl,
		size: sizeControl,
		disabled: {
			control: "boolean",
			description: "Whether the button is disabled",
		},
	},
	// Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
	args: {
		leftIcon: undefined,
		label: "Button",
		rightIcon: undefined,
		onClick: clickHandler,
		variant: "filled",
		size: SIZES.sm,
		disabled: false,
	},
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Borderless: Story = {
	args: {
		variant: "borderless",
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const button = canvas.getByRole("button");
		button.click();

		expect(clickHandler).toHaveBeenCalledOnce();
		expect(button).toHaveClass("bg-transparent");
	},
};

export const Small: Story = {
	args: {
		size: SIZES.sm,
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const button = canvas.getByRole("button");

		expect(button).toHaveClass("py-1 px-2 rounded-lg gap-1");
	},
};

export const Medium: Story = {
	args: {
		size: SIZES.md,
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const button = canvas.getByRole("button");

		expect(button).toHaveClass("py-2 px-4 rounded-xl gap-2");
	},
};

export const Large: Story = {
	args: {
		size: SIZES.lg,
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const button = canvas.getByRole("button");

		expect(button).toHaveClass("py-4 px-6 rounded-2xl gap-2");
	},
};

export const Gray: Story = {
	args: {
		variant: "gray",
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const button = canvas.getByRole("button");

		expect(button).toHaveClass("bg-black-5");
	},
};

export const Outline: Story = {
	args: {
		variant: "outline",
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const button = canvas.getByRole("button");

		expect(button).toHaveClass(
			"bg-transparent border-1 border-black-10 border-solid",
		);
	},
};

export const Filled: Story = {
	args: {
		variant: "filled",
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const button = canvas.getByRole("button");

		expect(button).toHaveClass("bg-primary-brand text-white-100");
	},
};

export const WithLeftIcon: Story = {
	args: {
		variant: "filled",
		leftIcon: FourLeafCloverIcon,
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const icon = canvas.getByTitle("left button icon");

		expect(icon).toBeInTheDocument();
	},
};

export const WithRightIcon: Story = {
	args: {
		variant: "filled",
		rightIcon: ArrowLineDownIcon,
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const icon = canvas.getByTitle("right button icon");

		expect(icon).toBeInTheDocument();
	},
};

export const WithBothIcons: Story = {
	args: {
		variant: "filled",
		leftIcon: FourLeafCloverIcon,
		rightIcon: ArrowLineDownIcon,
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const leftIcon = canvas.getByTitle("left button icon");
		const rightIcon = canvas.getByTitle("right button icon");

		expect(leftIcon).toBeInTheDocument();
		expect(rightIcon).toBeInTheDocument();
	},
};

export const Disabled: Story = {
	args: {
		variant: "filled",
		disabled: true,
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const button = canvas.getByRole("button");
		button.click();

		expect(clickHandler).not.toHaveBeenCalledOnce();
		expect(button).toHaveStyle(
			"background-color: rgba(28, 28, 28, 0.05); color: rgba(28, 28, 28, 0.1); cursor: not-allowed;",
		);
	},
};

export const LargeIconButton: Story = {
	args: {
		variant: "filled",
		size: SIZES.lg,
		leftIcon: FourLeafCloverIcon,
		label: undefined,
	},
};
