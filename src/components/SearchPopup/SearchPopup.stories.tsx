import { SearchPopup } from "@components";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { useState } from "react";
import { default as DropDown } from "../DropDown/DropDown.stories";

const testValue = "test";

const meta = {
	title: "Base Components/Search Popup",
	component: SearchPopup,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: "centered",
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ["autodocs"],
	// More on argTypes: https://storybook.js.org/docs/api/argtypes
	argTypes: {},
	// Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
	args: {
		progress: false,
		placeholder: "Search",
		disabled: false,
		dropdown: DropDown.args,
		value: "",
	},
	render: (args) => {
		const [value, setValue] = useState<string>(args.value as string);
		return (
			<SearchPopup
				{...args}
				value={value}
				onChange={(e) => setValue(e.target.value)}
			/>
		);
	},
} satisfies Meta<typeof SearchPopup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicSearchPopup: Story = {
	args: {},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByRole("textbox");

		expect(input).toBeInTheDocument();

		await userEvent.type(input, testValue);

		expect(input).toHaveValue(testValue);
	},
};
