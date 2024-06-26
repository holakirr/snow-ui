import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import { type BreadcrumbType, Breadcrumbs, ROLES } from "../../src";

const testBreadcrumbs: BreadcrumbType[] = [
	{ label: "Home", id: "home" },
	{ label: "Catalog", id: "catalog" },
	{ label: "Category", id: "category" },
	{ label: "Product", id: "product" },
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
		items: testBreadcrumbs,
	},
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const breadcrumbs = canvas.getByRole(ROLES.navigation);
		const breadcrumbItems = canvas.getAllByRole(ROLES.link);

		expect(breadcrumbs).toBeInTheDocument();
		expect(breadcrumbItems).toHaveLength(testBreadcrumbs.length);

		breadcrumbItems.forEach((breadcrumbItem, index) => {
			expect(breadcrumbItem).toHaveTextContent(testBreadcrumbs[index].label);
		});
	},
};

export const WithCustomSeparator: Story = {
	args: {
		separator: ">",
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const breadcrumbs = canvas.getByRole(ROLES.navigation);
		const breadcrumbItems = canvas.getAllByRole(ROLES.link);

		expect(breadcrumbs).toBeInTheDocument();
		expect(breadcrumbs).toHaveTextContent(testBreadcrumbs.map((item) => item.label).join(">"));
		expect(breadcrumbItems).toHaveLength(testBreadcrumbs.length);
	},
};

export const WithActiveItem: Story = {
	args: {
		items: [
			{ label: "Home", id: "home" },
			{ label: "Catalog", id: "catalog", active: true },
			{ label: "Category", id: "category" },
			{ label: "Product", id: "product" },
		],
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const breadcrumbs = canvas.getByRole(ROLES.navigation);
		const breadcrumbItems = canvas.getAllByRole(ROLES.link);

		expect(breadcrumbs).toBeInTheDocument();
		expect(breadcrumbItems).toHaveLength(testBreadcrumbs.length);

		breadcrumbItems.forEach((breadcrumbItem, index) => {
			if (index === 1) {
				expect(breadcrumbItem).toHaveAttribute("aria-current", "page");
			} else {
				expect(breadcrumbItem).not.toHaveAttribute("aria-current");
			}
		});
	},
};

export const WithDisabledItem: Story = {
	args: {
		items: [
			{ label: "Home", id: "home" },
			{ label: "Catalog", id: "catalog", disabled: true },
			{ label: "Category", id: "category" },
			{ label: "Product", id: "product" },
		],
	},
};

export const WithActiveAndDisabledItem: Story = {
	args: {
		items: [
			{ label: "Home", id: "home" },
			{ label: "Catalog", id: "catalog", active: true, disabled: true },
			{ label: "Category", id: "category" },
			{ label: "Product", id: "product" },
		],
	},
};
