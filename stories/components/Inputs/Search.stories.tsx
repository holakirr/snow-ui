import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { useState } from "react";
import { ROLES, Search } from "../../../src";
import { keyBindingsControl } from "../../mocks";

const testValue = "Test Value";

const meta: Meta<typeof Search> = {
	title: "Base Components/Inputs/Search",
	component: Search,
	argTypes: {
		keyBindings: keyBindingsControl,
	},
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
};

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
