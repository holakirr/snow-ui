import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip } from ".";
import { ArrowLineDownIcon, DefaultIcon, FourLeafCloverIcon } from "..";

const iconControls = {
	control: "radio",
	options: [
		FourLeafCloverIcon.displayName,
		DefaultIcon.displayName,
		"Nothing",
		ArrowLineDownIcon.displayName,
	],
	mapping: {
		Nothing: undefined,
		FourLeafCloverIcon,
		DefaultIcon,
		ArrowLineDownIcon,
	},
};

const meta = {
	title: "Base Components/Components/Tooltip",
	component: Tooltip,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: "centered",
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ["autodocs"],
	// More on argTypes: https://storybook.js.org/docs/api/argtypes
	argTypes: {
		icon: iconControls,
	},
	// Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
	args: {
		icon: undefined,
		label: "Tooltip",
	},
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicTooltip: Story = {
	args: {},
};

export const TooltipWithIcon: Story = {
	args: {
		icon: FourLeafCloverIcon,
	},
};
