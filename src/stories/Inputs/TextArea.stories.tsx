import { TextArea } from "@components";
import { ROLES, STATUSES } from "@constants";
import { statusControl, testErrorText, testInputPlaceholder } from "@mocks";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "@storybook/test";
import { type ChangeEvent, useState } from "react";

const testValue = "Test Value";
const testTextLimit = 100;
const testInputHandler = fn();

const meta = {
	title: "Base Components/Inputs/TextArea",
	component: TextArea,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: "centered",
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ["autodocs"],
	// More on argTypes: https://storybook.js.org/docs/api/argtypes
	argTypes: {
		status: statusControl,
	},
	// Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
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

export const BasicTextArea: Story = {
	args: {
		placeholder: "",
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByRole(ROLES.textarea);

		expect(input).toBeInTheDocument();

		await userEvent.type(input, testValue);

		expect(input).toHaveValue(testValue);
		expect(testInputHandler).toHaveBeenCalled();
	},
};

export const TextAreaWithPlaceholder: Story = {
	args: {},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByRole(ROLES.textarea);

		expect(input).toHaveAttribute("placeholder", testInputPlaceholder);
	},
};

export const DisabledTextArea: Story = {
	args: {
		disabled: true,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByRole(ROLES.textarea);

		expect(input).toBeDisabled();

		await userEvent.type(input, testValue);

		expect(input).not.toHaveValue(testValue);
		expect(testInputHandler).not.toHaveBeenCalled();
	},
};

export const SuccessTextArea: Story = {
	args: {
		status: STATUSES.success,
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const icon = canvas.getByRole(ROLES.icon);

		expect(icon).toBeInTheDocument();
		expect(icon).toHaveTextContent(`Icon for status ${STATUSES.success}`);
	},
};

export const ErrorTextArea: Story = {
	args: {
		status: STATUSES.error,
		error: testErrorText,
		placeholder: testInputPlaceholder,
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const icon = canvas.getByRole(ROLES.icon);
		const errorMsg = canvas.getByText(testErrorText);

		expect(icon).toBeInTheDocument();
		expect(icon).toHaveTextContent(`Icon for status ${STATUSES.error}`);
		expect(errorMsg).toBeInTheDocument();
	},
};

export const TextAreaWithLimit: Story = {
	args: {
		textLimit: testTextLimit,
	},
	play: async ({ canvasElement }) => {
		const longText =
			"This is a long text that will be used to test the text limit of the TextArea component. Next text is not gonna be shown.";
		const canvas = within(canvasElement);
		const input = canvas.getByRole(ROLES.textarea);

		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute("maxlength", testTextLimit.toString());

		await userEvent.type(input, testValue);

		expect(input).toHaveValue(testValue);
		expect(
			canvas.getByText(`${testValue.length}/${testTextLimit}`),
		).toBeInTheDocument();

		await userEvent.clear(input);
		await userEvent.type(input, longText);

		expect(input).toHaveValue(longText.slice(0, testTextLimit));
		expect(
			canvas.getByText(`${testTextLimit}/${testTextLimit}`),
		).toBeInTheDocument();
	},
};
