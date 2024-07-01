import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "@storybook/test";
import { type ChangeEvent, useState } from "react";
import { ROLES, Slider } from "../../../src";

const testId = "slider";
const testValue = 50;
const testChangeFunction = fn();
const testPlaceholder = "Text";

const meta = {
	title: "Base Components/Inputs/Slider",
	component: Slider,
	argTypes: {
		value: {
			control: "range",
			min: 0,
			max: 100,
			step: 1,
		},
	},
	args: {
		placeholder: testPlaceholder,
		disabled: false,
		value: testValue,
		id: testId,
		onChange: testChangeFunction,
	},
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	args: {},
	render: (args) => {
		const [value, setValue] = useState<number>(args.value as number);

		const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
			setValue(Number(e.target.value));
			testChangeFunction(e);
		};

		return <Slider {...args} value={value} onChange={changeHandler} />;
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const slider = canvas.getByRole(ROLES.slider);

		expect(slider).toBeInTheDocument();
		expect(slider).toHaveValue(testValue.toString());
	},
};

export const Disabled: Story = {
	args: {
		disabled: true,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const slider = canvas.getByRole(ROLES.slider);

		await userEvent.click(slider);

		expect(slider).not.toHaveFocus();
	},
};
