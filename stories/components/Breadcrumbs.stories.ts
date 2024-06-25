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
		controls: {
			exclude: ["children"],
		},
	},
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
