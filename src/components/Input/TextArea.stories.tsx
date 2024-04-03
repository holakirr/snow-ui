import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { TextArea } from ".";

const meta = {
	title: "Base Components/Components/TextArea",
	component: TextArea,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: "centered",
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ["autodocs"],
	// More on argTypes: https://storybook.js.org/docs/api/argtypes
	argTypes: {
		status: {
			control: "radio",
			options: [null, "progress", "success", "error"],
		},
	},
	// Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
	args: {
		placeholder: "Type something",
		disabled: false,
		error: "",
		value: "",
		status: undefined,
		title: "",
		id: "TextArea",
	},
	render: (args) => {
		const [value, setValue] = useState<string>("");
		return (
			<TextArea
				{...args}
				value={value}
				onChange={(e) => setValue(e.target.value)}
			/>
		);
	},
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicTextArea: Story = {
	args: {
		placeholder: "",
	},
};

export const TextAreaWithPlaceholder: Story = {
	args: {},
};

export const DisabledTextArea: Story = {
	args: {
		disabled: true,
	},
};

export const SuccessTextArea: Story = {
	args: {
		status: "success",
	},
};

export const ErrorTextArea: Story = {
	args: {
		status: "error",
		error: "Something went wrong",
		placeholder: "Type something",
	},
};

export const TextAreaWithLimit: Story = {
	args: {
		textLimit: 100,
	},
};
