import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import { type BreadcrumbType, Breadcrumbs, ROLES } from "../../src";

const testBreadcrumbs: BreadcrumbType[] = [
	{ label: "Home", id: "home" },
	{ label: "Products", id: "products" },
	{ label: "Product 1", id: "product-1" },
];

const meta = {
	title: "Base Components/Breadcrumbs",
	component: Breadcrumbs,
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
		breadcrumbs: testBreadcrumbs,
	},
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicBreadcrumbs: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const breadcrumbs = canvas.getByRole(ROLES.breadcrumbs);
		const breadcrumbItems = canvas.getAllByRole(ROLES.breadcrumbsItem);

		expect(breadcrumbs).toBeInTheDocument();
		expect(breadcrumbItems).toHaveLength(testBreadcrumbs.length);

		breadcrumbItems.forEach((breadcrumbItem, index) => {
			expect(breadcrumbItem).toHaveTextContent(testBreadcrumbs[index].label);
		});
	},
};

export const BreadcrumbsWithCustomSeparator: Story = {
	args: {
		separator: " > ",
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const breadcrumbs = canvas.getByRole(ROLES.breadcrumbs);
		const breadcrumbItems = canvas.getAllByRole(ROLES.breadcrumbsItem);

		expect(breadcrumbs).toBeInTheDocument();
		expect(breadcrumbs).toHaveTextContent("Home > Products > Product 1");
		expect(breadcrumbItems).toHaveLength(testBreadcrumbs.length);
	},
};