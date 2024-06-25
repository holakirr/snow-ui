import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import { KBD, ROLES } from "../../src";
import { keyBindingsControl, testKeyBindings } from "../mocks";

const testSeparator = "+";

const meta = {
	title: "Base Components/KBD",
	component: KBD,
	argTypes: {
		keyBindings: keyBindingsControl,
	},
	args: {
		keyBindings: testKeyBindings,
		separator: "",
	},
} satisfies Meta<typeof KBD>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicKBD: Story = {
	args: {},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const kbd = canvas.getByRole(ROLES.kbd);

		expect(kbd).toBeInTheDocument();
		expect(kbd).toHaveTextContent(testKeyBindings.join(""));
	},
};

export const KBDWithSeparator: Story = {
	args: {
		separator: testSeparator,
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const kbd = canvas.getByRole(ROLES.kbd);

		expect(kbd).toHaveTextContent(testKeyBindings.join(testSeparator));
	},
};
