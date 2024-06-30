import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "@storybook/test";
import { useState } from "react";
import { FourLeafCloverIcon, Input, ROLES, STATUSES } from "../../../src";
import {
	iconControl,
	statusControl,
	testErrorText,
	testInputPlaceholder,
	testTitle,
} from "../../mocks";

const testId = "input";
const testValue = "email@provider.com";
const testChangeFunction = fn();

const meta = {
	title: "Base Components/Inputs/Input",
	component: Input,
	argTypes: {
		icon: iconControl,
		status: statusControl,
	},
	args: {
		placeholder: testInputPlaceholder,
		icon: undefined,
		disabled: false,
		error: "",
		value: "",
		status: null,
		title: "",
		id: testId,
		clearable: false,
	},
	render: (args) => {
		const [value, setValue] = useState<string>(args.value as string);
		const handleClear = () => setValue("");
		const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			setValue(e.target.value);
			return testChangeFunction();
		};

		return <Input {...args} value={value} onChange={handleChange} onClear={handleClear} />;
	},
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	args: {
		placeholder: "",
		id: "email",
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByRole(ROLES.textbox);

		// 👇 Simulate interactions with the component
		await userEvent.type(input, testValue);

		// 👇 Assert DOM structure
		expect(input.getAttribute("value")).toBe(testValue);
		expect(input.focus).toBeTruthy();
		expect(testChangeFunction).toHaveBeenCalled();
	},
};

export const WithPlaceholder: Story = {
	args: {},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByRole(ROLES.textbox);

		expect(input.getAttribute("placeholder")).toBe(testInputPlaceholder);
	},
};

export const WithIconAndPlaceholder: Story = {
	args: {
		icon: FourLeafCloverIcon,
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const icon = canvas.getByRole(ROLES.img);

		expect(icon).toBeInTheDocument();
		expect(icon).toHaveTextContent(`Icon in input with id ${testId}`);
	},
};

export const Disabled: Story = {
	args: {
		disabled: true,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByRole(ROLES.textbox);
		await userEvent.type(input, testValue);

		expect(input).toBeDisabled();
		expect(testChangeFunction).not.toHaveBeenCalled();
	},
};

export const SuccessStatus: Story = {
	args: {
		status: STATUSES.success,
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const icon = canvas.getByRole(ROLES.img);

		expect(icon).toBeInTheDocument();
		expect(icon).toHaveTextContent(`Icon for status ${STATUSES.success}`);
	},
};

export const ErrorStatus: Story = {
	args: {
		status: STATUSES.error,
		error: testErrorText,
		placeholder: testInputPlaceholder,
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByRole(ROLES.textbox);
		const icon = canvas.getByRole(ROLES.img);
		const error = canvas.getByText(testErrorText);

		expect(icon).toBeInTheDocument();
		expect(icon).toHaveTextContent(`Icon for status ${STATUSES.error}`);
		expect(error).toBeInTheDocument();
		expect(input).toHaveClass("border-secondary-red");
	},
};

export const WithTitle: Story = {
	args: {
		title: testTitle,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const title = canvas.getByText(testTitle);

		expect(title).toBeInTheDocument();
		expect(title).toHaveStyle({ fontSize: "18px" });
	},
};

export const WithTitleAndValueAndStatus: Story = {
	args: {
		title: testTitle,
		value: "Value",
		status: STATUSES.progress,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const title = canvas.getByText(testTitle);
		const icon = canvas.getByRole(ROLES.img);

		expect(title).toBeInTheDocument();
		expect(title).toHaveStyle({ fontSize: "12px" });
		expect(icon).toBeInTheDocument();
		expect(icon).toHaveTextContent(`Icon for status ${STATUSES.progress}`);
	},
};

export const Clearable: Story = {
	args: {
		title: testTitle,
		clearable: true,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByRole(ROLES.textbox);

		await userEvent.type(input, testValue);

		const clearButton = canvas.getByTitle(`Clear input ${testTitle} with id ${testId}`);

		expect(clearButton).toBeInTheDocument();

		await userEvent.click(clearButton);

		expect(input.getAttribute("value")).toBe("");

		await userEvent.type(input, testValue);
	},
};
