import { BreadcrumbsItem } from "@components";
import { testText } from "@mocks";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
	title: "Base Components/Breadcrumbs/Breadcrumbs Item",
	component: BreadcrumbsItem,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: "centered",
		controls: {
			exclude: ["children"],
		},
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ["autodocs"],
	// More on argTypes: https://storybook.js.org/docs/api/argtypes
	argTypes: {},
	// Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
	args: {
		label: testText,
		id: "home",
		active: false,
	},
} satisfies Meta<typeof BreadcrumbsItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicBreadcrumbsItem: Story = {};

export const ActiveBreadcrumbsItem: Story = {
	args: {
		active: true,
	},
};
