import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { useState } from "react";
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
		status: {
			control: "radio",
			options: [null, "progress", "success", "error"],
		},
	},
	// Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
	args: {
		placeholder: "Type something",
		icon: undefined,
		disabled: false,
		error: "",
		value: "",
		status: null,
		onChange: fn(),
		title: "",
		id: "input",
	},
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicInput: Story = {
	args: {
		placeholder: "",
	},
};

export const InputWithPlaceholder: Story = {
	args: {},
};

export const InputWithIconAndPlaceholder: Story = {
	args: {
		icon: FourLeafCloverIcon,
	},
};

export const DisabledInput: Story = {
	args: {
		disabled: true,
	},
};

export const SuccessInput: Story = {
	args: {
		status: "success",
	},
};

export const ErrorInput: Story = {
	args: {
		status: "error",
		error: "Something went wrong",
		placeholder: "Type something",
	},
	decorators: [(Story) => <div className="w-96">{Story()}</div>],
	render: (args) => {
		const [value, setValue] = useState("fdsads");
		return (
			<Input
				{...args}
				value={value}
				onChange={(e) => setValue(e.target.value)}
			/>
		);
	},
};

export const InputWithTitle: Story = {
	args: {
		title: "Title",
	},
};

export const InputWithTitleAndValue: Story = {
	args: {
		title: "Title",
		value: "Value",
	},
};

export const InputWithTitleAndValueAndStatus: Story = {
	args: {
		title: "Title",
		value: "Value",
		status: "progress",
	},
};
