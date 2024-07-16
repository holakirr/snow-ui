import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "@storybook/test";
import { useState } from "react";
import { ROLES, Switch } from "../../../src";

const testName = "Test Name";
const testId = "test-id";
const testOnChange = fn((e) => console.log("onChange", e));

const meta: Meta<typeof Switch> = {
	title: "Base Components/Inputs/Switch",
	component: Switch,
	args: {
		id: testId,
		name: testName,
		checked: false,
		disabled: false,
		onChange: testOnChange,
	},
	render: (args) => {
		const [checked, setChecked] = useState(args.checked);

		return (
			<Switch
				{...args}
				checked={checked}
				onChange={(e) => {
					args.onChange?.(e);
					setChecked(e.target.checked);
				}}
			/>
		);
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	args: {},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const Switch = canvas.getByRole(ROLES.switch);
		const Label = Switch.parentElement as HTMLLabelElement;

		expect(Switch).not.toBeChecked();

		await userEvent.click(Label);

		expect(Switch).toBeChecked();
		expect(testOnChange).toHaveBeenCalled();

		await userEvent.click(Label);
	},
};

export const Checked: Story = {
	args: {
		checked: true,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const Switch = canvas.getByRole(ROLES.switch);
		const Label = Switch.parentElement as HTMLLabelElement;

		expect(Switch).toBeChecked();

		await userEvent.click(Label);

		expect(Switch).not.toBeChecked();
		expect(testOnChange).toHaveBeenCalled();

		await userEvent.click(Label);
	},
};

export const Disabled: Story = {
	args: {
		disabled: true,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const Switch = canvas.getByRole(ROLES.switch);

		expect(Switch).toBeDisabled();

		await userEvent.click(Switch);

		expect(Switch).not.toBeChecked();
		expect(testOnChange).not.toHaveBeenCalled();
	},
};
