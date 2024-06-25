import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import { DropDown, type DropDownItemType, ROLES } from "../../../src";
import { testLink } from "../../mocks";
import {
	DropDownItemWithImage,
	DropDownItemWithKeyBindings,
	DropDownItemWithSubtitle,
} from "./DropDownItem.stories";

const listTitle = "DropDownItems";

const meta = {
	title: "Base Components/Dropdown/Dropdown",
	component: DropDown,
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
				] as DropDownItemType[],
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
