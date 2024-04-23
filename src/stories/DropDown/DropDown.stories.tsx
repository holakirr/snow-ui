import { DropDown, type DropDownItemProps } from "@components";
import { ROLES } from "@constants";
import { testLink } from "@mocks";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import {
	DropDownItemWithImage,
	DropDownItemWithKeyBindings,
	DropDownItemWithSubtitle,
} from "./DropDownItem.stories";

const listTitle = "DropDownItems";

const meta = {
	title: "Base Components/Dropdown/Dropdown",
	component: DropDown,
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
		lists: [
			{
				title: listTitle,
				items: [
					{
						...DropDownItemWithImage.args,
						title: "DropDownItemWithImage",
						href: testLink,
					},
					{
						...DropDownItemWithKeyBindings.args,
						title: "DropDownItemWithKeyBindings",
						href: testLink,
					},
					{
						...DropDownItemWithSubtitle.args,
						title: "DropDownItemWithSubtitle",
						href: testLink,
					},
				] as DropDownItemProps[],
			},
		],
	},
} satisfies Meta<typeof DropDown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DropDownBasic: Story = {
	args: {},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const dropDown = canvas.getByRole(ROLES.dropdown);
		const list = canvas.getByRole(ROLES.dropdownList);
		const items = canvas.getAllByRole(ROLES.dropdownItem);

		expect(list).toBeInTheDocument();
		expect(dropDown).toHaveTextContent(listTitle);
		expect(items).toHaveLength(3);
	},
};
