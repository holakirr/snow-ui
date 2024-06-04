import { Breadcrumbs } from "@components";
import { ROLES } from "@constants";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "@storybook/test";
import type { BreadcrumbType } from "@types";

const testBreadcrumbs: BreadcrumbType[] = [
	{ label: "Home", id: "home" },
	{ label: "Products", id: "products" },
	{ label: "Product 1", id: "product-1" },
];
const testOnItemSelect = fn();

const meta = {
	title: "Base Components/Breadcrumbs/Breadcrumbs",
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
		onItemSelect: testOnItemSelect,
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

		await userEvent.click(breadcrumbItems[0]);

		expect(testOnItemSelect).toHaveBeenCalledWith("home");
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
