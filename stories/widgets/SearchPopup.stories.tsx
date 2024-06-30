import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { useState } from "react";
import { ROLES, SearchPopup } from "../../src";
import { default as DropDown } from "../components/DropDown.stories";

const testValue = "test";

const meta = {
	title: "Widgets/Search Popup",
	component: SearchPopup,
	args: {
		progress: false,
		placeholder: "Search",
		disabled: false,
		dropdown: DropDown.args,
		value: "",
	},
	render: (args) => {
		const [value, setValue] = useState<string>(args.value as string);
		return <SearchPopup {...args} value={value} onChange={(e) => setValue(e.target.value)} />;
	},
} satisfies Meta<typeof SearchPopup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicSearchPopup: Story = {
	args: {},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const searchPopup = canvas.getByRole(ROLES.dialog);
		const input = canvas.getByRole(ROLES.search);

		expect(searchPopup).toBeInTheDocument();
		expect(input).toBeInTheDocument();

		await userEvent.type(input, testValue);

		expect(input).toHaveValue(testValue);
	},
};
