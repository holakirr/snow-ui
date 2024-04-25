import { FourLeafCloverIcon, NavigationItem } from "@components";
import { ROLES } from "@constants";
import { iconControl } from "@mocks";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "@storybook/test";
import { useNavigationItem } from "@utils";

const testLabel = "Navigation Item";
const testClickHandler = fn((e) =>
	console.log(`clicked on ${e.currentTarget.id}`),
);

const meta = {
	title: "Base Components/Navigation/Navigation Item",
	component: NavigationItem,
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
	argTypes: {
		icon: iconControl,
	},
	// Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
	args: {
		label: testLabel,
		id: "navigation-item",
		expanded: false,
		onClick: testClickHandler,
		items: [
			{
				label: "Sub Item 1",
				id: "sub-item-1",
				icon: FourLeafCloverIcon,
			},
			{
				label: "Sub Item 2",
				id: "sub-item-2",
			},
			{
				label: "Sub Item 3",
				id: "sub-item-3",
				items: [
					{
						label: "Sub Sub Item 1",
						id: "sub-sub-item-1",
					},
					{
						label: "Sub Sub Item 2",
						id: "sub-sub-item-2",
					},
					{
						label: "Sub Sub Item 3",
						id: "sub-sub-item-3",
						items: [
							{
								label: "Sub Sub Sub Item 1",
								id: "sub-sub-sub-item-1",
							},
							{
								label: "Sub Sub Sub Item 2",
								id: "sub-sub-sub-item-2",
							},
							{
								label: "Sub Sub Sub Item 3",
								id: "sub-sub-sub-item-3",
							},
						],
					},
				],
			},
		],
	},
	render: (args) => {
		const { item, onClickHandler } = useNavigationItem(args);

		return <NavigationItem {...item} onClick={onClickHandler} />;
	},
} satisfies Meta<typeof NavigationItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SimpleNavigationItem: Story = {
	args: {
		items: undefined,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const navigationItem = canvas.getByRole(ROLES.navigationItem, {
			name: testLabel,
		});

		expect(navigationItem).toBeInTheDocument();
		expect(navigationItem).not.toHaveClass("bg-black-5");

		await userEvent.click(navigationItem);

		expect(navigationItem).toHaveClass("bg-black-5");
	},
};

export const ComplexNavigationItem: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const navigationItem = canvas.getByRole(ROLES.navigationItem, {
			name: testLabel,
		});
		const subMenu = canvas.getByRole(ROLES.navigationSubMenu, {
			name: `Submenu for ${testLabel}`,
		});
		const subItem = canvas.getByRole(ROLES.navigationItem, {
			name: "Sub Item 3",
		});
		const subSubMenu = canvas.getByRole(ROLES.navigationSubMenu, {
			name: "Submenu for Sub Item 3",
		});
		const subSubItem = canvas.getByRole(ROLES.navigationItem, {
			name: "Sub Sub Item 3",
		});
		const subSubSubMenu = canvas.getByRole(ROLES.navigationSubMenu, {
			name: "Submenu for Sub Sub Item 3",
		});
		const subSubSubItem = canvas.getByRole(ROLES.navigationItem, {
			name: "Sub Sub Sub Item 1",
		});

		expect(navigationItem).toBeInTheDocument();
		expect(subMenu).toBeInTheDocument();
		expect(subMenu.style.maxHeight).toBe("0px");
		expect(subItem).toBeInTheDocument();
		expect(subSubMenu).toBeInTheDocument();
		expect(subSubMenu.style.maxHeight).toBe("0px");
		expect(subSubItem).toBeInTheDocument();
		expect(subSubSubMenu).toBeInTheDocument();
		expect(subSubSubMenu.style.maxHeight).toBe("0px");
		expect(subSubSubItem).toBeInTheDocument();

		await userEvent.click(navigationItem);

		expect(subMenu.style.maxHeight).not.toBe("0px");
		expect(subSubMenu.style.maxHeight).toBe("0px");
		expect(subSubSubMenu.style.maxHeight).toBe("0px");

		await userEvent.click(subItem);

		expect(subMenu.style.maxHeight).not.toBe("0px");
		expect(subSubMenu.style.maxHeight).not.toBe("0px");
		expect(subSubSubMenu.style.maxHeight).toBe("0px");

		await userEvent.click(subSubItem);

		expect(subMenu.style.maxHeight).not.toBe("0px");
		expect(subSubMenu.style.maxHeight).not.toBe("0px");
		expect(subSubSubMenu.style.maxHeight).not.toBe("0px");

		await userEvent.click(subSubSubItem);

		expect(subSubSubItem).toHaveClass("bg-black-5");
	},
};
