import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Input } from ".";
import { FourLeafCloverIcon } from "..";
import { STATUSES } from "../../consts";
import { iconControl, statusControl } from "../../utils";

const meta = {
	title: "Base Components/Inputs/Input",
	component: Input,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: "centered",
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ["autodocs"],
	// More on argTypes: https://storybook.js.org/docs/api/argtypes
	argTypes: {
		icon: iconControl,
		status: statusControl,
	},
	// Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
	args: {
		placeholder: "Type something",
		icon: undefined,
		disabled: false,
		error: "",
		value: "",
		status: null,
		onChange: console.log,
		title: "",
		id: "input",
		clearable: false,
	},
	render: (args) => {
		const [value, setValue] = useState<string>("Value");
		return (
			<Input
				{...args}
				value={value}
				onChange={(e) => setValue(e.target.value)}
			/>
		);
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
		status: STATUSES.success,
	},
};

export const ErrorInput: Story = {
	args: {
		status: STATUSES.error,
		error: "Something went wrong",
		placeholder: "Type something",
	},
};

export const InputWithTitle: Story = {
	args: {
		title: "Title",
	},
};

export const InputWithTitleAndValueAndStatus: Story = {
	args: {
		title: "Title",
		value: "Value",
		status: STATUSES.progress,
	},
};

export const ClearableInput: Story = {
	args: {
		title: "Title",
		clearable: true,
	},
};
