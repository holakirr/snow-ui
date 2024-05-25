import { NavigationItem } from "@components";
import { ROLES } from "@constants";
import { useNavigation } from "@hooks";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "@storybook/test";
import type { MouseEventHandler } from "react";
import {
	iconControl,
	navigationMenuItems,
	onNavigationItemClick,
} from "../mocks";

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
		onClick: onNavigationItemClick,
	},
	// Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
	args: {
		onClick: testClickHandler,
		...navigationMenuItems[0],
	},
	render: (args) => {
		const { items, onClickHandler } = useNavigation([args]);
		const onItemClickHandler: MouseEventHandler<HTMLLIElement> = (e) => {
			args.onClick(e);
			onClickHandler(e);
		};

		return <NavigationItem {...items[0]} onClick={onItemClickHandler} />;
	},
} satisfies Meta<typeof NavigationItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SimpleNavigationItem: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const navigationItem = canvas.getByRole(ROLES.navigationItem, {
			name: navigationMenuItems[0].label,
		});

		expect(navigationItem).toBeInTheDocument();
		expect(navigationItem).not.toHaveClass("bg-black-5");

		await userEvent.click(navigationItem);

		expect(navigationItem).toHaveClass("bg-black-5");
		expect(testClickHandler).toHaveBeenCalledWith(
			expect.objectContaining({
				target: expect.objectContaining({ id: navigationItem.id }),
			}),
		);
	},
};

export const ComplexNavigationItem: Story = {
	args: {
		...navigationMenuItems[2],
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const navigationItem = canvas.getByRole(ROLES.navigationItem, {
			name: navigationMenuItems[2].label,
		});
		const subMenu = canvas.getByRole(ROLES.navigationMenu, {
			name: `Navigation Menu ${navigationItem.getAttribute("aria-label")}`,
		});
		const subItem = canvas.getByRole(ROLES.navigationItem, {
			name: "Sub Item 3",
		});
		const subSubMenu = canvas.getByRole(ROLES.navigationMenu, {
			name: `Navigation Menu ${subItem.getAttribute("aria-label")}`,
		});
		const subSubItem = canvas.getByRole(ROLES.navigationItem, {
			name: "Sub Sub Item 3",
		});

		expect(navigationItem).toBeInTheDocument();
		expect(subMenu).toBeInTheDocument();
		expect(subMenu).toHaveClass("grid-rows-[0fr]");
		expect(subItem).toBeInTheDocument();
		expect(subSubMenu).toBeInTheDocument();
		expect(subSubMenu).toHaveClass("grid-rows-[0fr]");
		expect(subSubItem).toBeInTheDocument();

		await userEvent.click(navigationItem);

		expect(testClickHandler).toHaveBeenCalledWith(
			expect.objectContaining({
				target: expect.objectContaining({ id: navigationItem.id }),
			}),
		);
		expect(subMenu).toHaveClass("grid-rows-[1fr]");
		expect(subSubMenu).toHaveClass("grid-rows-[0fr]");

		await userEvent.click(subItem);

		expect(testClickHandler).toHaveBeenCalledWith(
			expect.objectContaining({
				target: expect.objectContaining({ id: subItem.id }),
			}),
		);
		expect(subMenu).toHaveClass("grid-rows-[1fr]");
		expect(subSubMenu).toHaveClass("grid-rows-[1fr]");

		await userEvent.click(subSubItem);

		expect(testClickHandler).toHaveBeenCalledWith(
			expect.objectContaining({
				target: expect.objectContaining({ id: subSubItem.id }),
			}),
		);
		expect(subMenu).toHaveClass("grid-rows-[1fr]");
		expect(subSubMenu).toHaveClass("grid-rows-[1fr]");
		expect(subSubItem).toHaveClass("bg-black-5");
	},
};
