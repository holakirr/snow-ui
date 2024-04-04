import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Button } from ".";
import { ArrowLineDownIcon, FourLeafCloverIcon } from "..";
import { SIZES } from "../../consts";
import { buttonVariantControl, iconControl, sizeControl } from "../../utils";

const meta = {
	title: "Base Components/Components/Button",
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
		onClick: fn(),
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
};

export const Gray: Story = {
	args: {
		variant: "gray",
	},
};

export const Outline: Story = {
	args: {
		variant: "outline",
	},
};

export const Filled: Story = {
	args: {
		variant: "filled",
	},
};

export const WithLeftIcon: Story = {
	args: {
		variant: "filled",
		leftIcon: FourLeafCloverIcon,
	},
};

export const WithRightIcon: Story = {
	args: {
		variant: "filled",
		rightIcon: ArrowLineDownIcon,
	},
};

export const WithBothIcons: Story = {
	args: {
		variant: "filled",
		leftIcon: FourLeafCloverIcon,
		rightIcon: ArrowLineDownIcon,
	},
};

export const Disabled: Story = {
	args: {
		variant: "filled",
		disabled: true,
	},
};

export const IconButton: Story = {
	args: {
		variant: "filled",
		size: SIZES.lg,
		leftIcon: FourLeafCloverIcon,
		label: "",
	},
};
