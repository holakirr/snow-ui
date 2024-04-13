import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip } from ".";
import { FourLeafCloverIcon } from "..";
import { iconControl } from "../Icons/Icons.stories";

const meta = {
	title: "Base Components/Tooltip",
	component: Tooltip,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: "centered",
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ["autodocs"],
	// More on argTypes: https://storybook.js.org/docs/api/argtypes
	argTypes: {
		icon: iconControl,
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
