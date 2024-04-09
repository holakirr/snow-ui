import type { Meta, StoryObj } from "@storybook/react";
import { KBD } from ".";
import { keyBindingsControl } from "../../utils";

const meta = {
	title: "Base Components/KBD",
	component: KBD,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: "centered",
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ["autodocs"],
	// More on argTypes: https://storybook.js.org/docs/api/argtypes
	argTypes: {
		keyBindings: keyBindingsControl,
	},
	// Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
	args: {
		keyBindings: ["Ctrl", "C"],
	},
} satisfies Meta<typeof KBD>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicKBD: Story = {
	args: {},
};

export const KBDWithSeparator: Story = {
	args: {
		separator: "+",
	},
};
