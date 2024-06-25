import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import { DropDownItem, ROLES } from "../../../src";
import {
	imageControl,
	imageMocks,
	keyBindingsControl,
	testKeyBindings,
	testLink,
	testSubtitle,
	testTitle,
} from "../../mocks";

const meta: Meta<typeof DropDownItem> = {
	title: "Base Components/Dropdown/Dropdown Item",
	component: DropDownItem,
	argTypes: {
		keyBindings: keyBindingsControl,
		img: imageControl,
	},
	args: {
		title: testTitle,
		href: testLink,
	},
	decorators: [
		(Story) => (
			<div
				style={{
					width: "100%",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<Story />
			</div>
		),
	],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const DropDownItemBasic: Story = {
	args: {},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const item = canvas.getByRole(ROLES.dropdownItem);
		const link = canvas.getByRole("link");
		const img = canvas.getByTitle(`Search icon for ${testTitle}`);

		expect(item).toBeInTheDocument();
		expect(item).toHaveTextContent(testTitle);
		expect(link).toHaveAttribute("href", testLink);
		expect(img).toBeInTheDocument();
	},
};

export const DropDownItemWithSubtitle: Story = {
	args: {
		subtitle: testSubtitle,
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const subtitle = canvas.getByText(testSubtitle);

		expect(subtitle).toBeInTheDocument();
	},
};

export const DropDownItemWithKeyBindings: Story = {
	args: {
		keyBindings: testKeyBindings,
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const kbd = canvas.getByText(testKeyBindings.join(""));

		expect(kbd).toBeInTheDocument();
		expect(kbd).toHaveAttribute("aria-keyshortcuts", testKeyBindings.join(""));
	},
};

export const DropDownItemWithImage: Story = {
	args: {
		img: imageMocks.woman,
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const img = canvas.getByAltText("woman");

		expect(img).toBeInTheDocument();
	},
};

export const DropDownItemWithEverything: Story = {
	args: {
		subtitle: testSubtitle,
		keyBindings: testKeyBindings,
		img: imageMocks.woman,
	},
};
