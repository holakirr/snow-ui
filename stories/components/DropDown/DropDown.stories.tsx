import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { useState } from "react";
import {
	Button,
	DropDown,
	DropDownItem,
	DropDownMenu,
	DropDownSection,
	ROLES,
	Text,
} from "../../../src";

const testButtonLabel = "Open/Close";
const dropdownContent = "Dropdown Content";
const testList1 = ["Option 1", "Option 2", "Option 3"];
const testList2 = ["Option 4", "Option 5", "Option 6"];

const meta = {
	title: "Base Components/Dropdown/Dropdown",
	component: DropDown,
	args: {
		position: "bottom",
		visible: false,
		children: [<Text key="content">{dropdownContent}</Text>],
	},
	render: (args) => {
		const { visible, ...rest } = args;
		const [visibleProp, setVisibleProp] = useState(args.visible);

		const handleTriggerClick = () => {
			setVisibleProp((prev) => !prev);
		};

		return (
			<DropDown {...rest} visible={visibleProp}>
				<Button label={testButtonLabel} onClick={handleTriggerClick} />
				<DropDownMenu>
					<DropDownSection>
						{testList1.map((item) => (
							<DropDownItem key={item}>{item}</DropDownItem>
						))}
					</DropDownSection>
				</DropDownMenu>
				{args.children}
			</DropDown>
		);
	},
} satisfies Meta<typeof DropDown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DropDownBasic: Story = {
	args: {},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const button = canvas.getByRole(ROLES.button);

		await userEvent.click(button);

		const dropDown = canvas.getByRole(ROLES.dropdown);
		const items = canvas.getAllByRole(ROLES.dropdownItem);

		expect(dropDown).toBeInTheDocument();
		expect(items).toHaveLength(3);
	},
};

export const WithDivider: Story = {
	args: {},
	render: (args) => {
		const { visible, ...rest } = args;
		const [visibleProp, setVisibleProp] = useState(args.visible);

		const handleTriggerClick = () => {
			setVisibleProp((prev) => !prev);
		};

		return (
			<DropDown {...rest} visible={visibleProp}>
				<Button label={testButtonLabel} onClick={handleTriggerClick} />
				<DropDownMenu>
					<DropDownSection showDivider>
						{testList1.map((item) => (
							<DropDownItem key={item}>{item}</DropDownItem>
						))}
					</DropDownSection>
					<DropDownSection>
						{testList2.map((item) => (
							<DropDownItem key={item}>{item}</DropDownItem>
						))}
					</DropDownSection>
				</DropDownMenu>
				{args.children}
			</DropDown>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const button = canvas.getByRole(ROLES.button);

		await userEvent.click(button);

		const dropDown = canvas.getByRole(ROLES.dropdown);
		const dropDownMenu = canvas.getByRole(ROLES.dropdownMenu);
		const sections = canvas.getAllByRole(ROLES.dropdownSection);

		expect(dropDown).toBeInTheDocument();
		expect(dropDownMenu).toBeInTheDocument();
		expect(sections).toHaveLength(2);
	},
};
