import type { Meta, StoryObj } from "@storybook/react";
import { Input } from ".";
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
	title: "Base Components/Components/Input",
	component: Input,
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
		placeholder: "",
		icon: undefined,
		disabled: false,
	},
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicInput: Story = {
	args: {},
};

export const InputWithPlaceholder: Story = {
	args: {
		placeholder: "Type something",
	},
};

export const InputWithIconAndPlaceholder: Story = {
	args: {
		placeholder: "Type something",
		icon: FourLeafCloverIcon,
	},
};

export const DisabledInput: Story = {
	args: {
		placeholder: "Type something",
		disabled: true,
	},
};
