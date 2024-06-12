import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { useState } from "react";
import { ROLES, Search } from "../../../src";
import { keyBindingsControl } from "../../mocks";

const testValue = "Test Value";

const meta = {
	title: "Base Components/Inputs/Search",
	component: Search,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: "centered",
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ["autodocs"],
	// More on argTypes: https://storybook.js.org/docs/api/argtypes
	argTypes: {
		keyBindings: keyBindingsControl,
	},
	// Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
	args: {
		placeholder: "Search",
		value: "",
		id: "Search",
	},
	render: (args) => {
		const [value, setValue] = useState<string>(args.value as string);
		return <Search {...args} value={value} onChange={(e) => setValue(e.target.value)} />;
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByRole(ROLES.search);

		expect(input).toBeInTheDocument();

		await userEvent.type(input, testValue);

		expect(input).toHaveValue(testValue);
	},
} satisfies Meta<typeof Search>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicSearch: Story = {
	args: {},
};

export const GraySearch: Story = {
	args: {
		variant: "gray",
	},
};
