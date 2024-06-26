import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "@storybook/test";
import { type ChangeEvent, useState } from "react";
import { ROLES, STATUSES, TextArea } from "../../../src";
import { statusControl, testErrorText, testInputPlaceholder } from "../../mocks";

const testValue = "Test Value";
const testTextLimit = 100;
const testInputHandler = fn();

const meta = {
	title: "Base Components/Inputs/TextArea",
	component: TextArea,
	argTypes: {
		status: statusControl,
	},
	args: {
		placeholder: testInputPlaceholder,
		disabled: false,
		error: "",
		value: "",
		status: undefined,
		title: "",
		id: "TextArea",
	},
	render: (args) => {
		const [value, setValue] = useState<string>(args.value as string);
		const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
			setValue(e.target.value);
			return testInputHandler();
		};

		return <TextArea {...args} value={value} onChange={handleChange} />;
	},
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	args: {
		placeholder: "",
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByRole(ROLES.textbox);

		expect(input).toBeInTheDocument();

		await userEvent.type(input, testValue);

		expect(input).toHaveValue(testValue);
		expect(testInputHandler).toHaveBeenCalled();
	},
};

export const WithPlaceholder: Story = {
	args: {},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByRole(ROLES.textbox);

		expect(input).toHaveAttribute("placeholder", testInputPlaceholder);
	},
};

export const Disabled: Story = {
	args: {
		disabled: true,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByRole(ROLES.textbox);

		expect(input).toBeDisabled();

		await userEvent.type(input, testValue);

		expect(input).not.toHaveValue(testValue);
		expect(testInputHandler).not.toHaveBeenCalled();
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
		const icon = canvas.getByRole(ROLES.img);
		const errorMsg = canvas.getByText(testErrorText);

		expect(icon).toBeInTheDocument();
		expect(icon).toHaveTextContent(`Icon for status ${STATUSES.error}`);
		expect(errorMsg).toBeInTheDocument();
	},
};

export const WithLimit: Story = {
	args: {
		textLimit: testTextLimit,
	},
	play: async ({ canvasElement }) => {
		const longText =
			"This is a long text that will be used to test the text limit of the TextArea component. Next text is not gonna be shown.";
		const canvas = within(canvasElement);
		const input = canvas.getByRole(ROLES.textbox);

		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute("maxlength", testTextLimit.toString());

		await userEvent.type(input, testValue);

		expect(input).toHaveValue(testValue);
		expect(canvas.getByText(`${testValue.length}/${testTextLimit}`)).toBeInTheDocument();

		await userEvent.clear(input);
		await userEvent.type(input, longText);

		expect(input).toHaveValue(longText.slice(0, testTextLimit));
		expect(canvas.getByText(`${testTextLimit}/${testTextLimit}`)).toBeInTheDocument();
	},
};
