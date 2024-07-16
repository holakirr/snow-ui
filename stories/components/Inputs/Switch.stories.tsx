import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "@storybook/test";
import { ROLES, Switch } from "../../../src";

const testName = "Test Name";
const testOnChange = fn((e) => console.log("onChange", e));

const meta: Meta<typeof Switch> = {
	title: "Base Components/Inputs/Switch",
	component: Switch,
	args: {
		name: testName,
		checked: false,
		disabled: false,
		onChange: testOnChange,
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	args: {},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const Switch = canvas.getByRole(ROLES.switch);

		expect(Switch).not.toBeChecked();

		await userEvent.click(Switch);

		expect(Switch).toBeChecked();
		expect(testOnChange).toHaveBeenCalled();
	},
};

export const Checked: Story = {
	args: {
		checked: true,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const Switch = canvas.getByRole(ROLES.switch);

		expect(Switch).toBeChecked();

		await userEvent.click(Switch);

		expect(Switch).not.toBeChecked();
		expect(testOnChange).toHaveBeenCalled();
	},
};

export const Disabled: Story = {
	args: {
		disabled: true,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const Switch = canvas.getByRole(ROLES.switch);

		expect(Switch).not.toBeChecked();

		await userEvent.click(Switch);

		expect(Switch).not.toBeChecked();
		expect(testOnChange).not.toHaveBeenCalled();
	},
};
