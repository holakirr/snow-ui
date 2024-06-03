import { NavigationMenu } from "@components";
import { ROLES } from "@constants";
import { useNavigation } from "@hooks";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "@storybook/test";
import type { MouseEventHandler } from "react";
import { navigationMenuItems, onNavigationItemClick } from "../mocks";

const testClickHandler = fn((e) => console.log(`clicked on ${e.currentTarget.id}`));
const testTitle = "Test";

const meta = {
	title: "Base Components/Navigation/Navigation Menu",
	component: NavigationMenu,
	parameters: {
		layout: "centered",
		controls: {
			exclude: ["children"],
		},
	},
	tags: ["autodocs"],
	argTypes: {
		onItemClick: onNavigationItemClick,
	},
	args: {
		opened: true,
		items: navigationMenuItems,
		onItemClick: testClickHandler,
		title: testTitle,
	},
	render: (args) => {
		const { items, onClickHandler } = useNavigation(args.items);
		const onItemClickHandler: MouseEventHandler<HTMLLIElement> = (e) => {
			args.onItemClick(e);
			onClickHandler(e);
		};

		return <NavigationMenu {...args} items={items} onItemClick={onItemClickHandler} />;
	},
} satisfies Meta<typeof NavigationMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicNavigationMenu: Story = {
	play: async (context) => {
		const canvas = within(context.canvasElement);
		const menu = canvas.getByRole(ROLES.navigationMenu, {
			name: `Navigation Menu ${testTitle}`,
		});
		const item2 = canvas.getByRole(ROLES.navigationItem, {
			name: "Item 2",
		});
		const item3 = canvas.getByRole(ROLES.navigationItem, {
			name: "Item 3",
		});
		const subMenu2 = canvas.getByRole(ROLES.navigationMenu, {
			name: `Navigation Menu ${item2.getAttribute("aria-label")}`,
		});
		const subMenu3 = canvas.getByRole(ROLES.navigationMenu, {
			name: `Navigation Menu ${item3.getAttribute("aria-label")}`,
		});
		const subMenu3Item3 = canvas.getByRole(ROLES.navigationItem, {
			name: "Sub Item 3",
		});
		const subMenu3Item3SubMenu = canvas.getByRole(ROLES.navigationMenu, {
			name: `Navigation Menu ${subMenu3Item3.getAttribute("aria-label")}`,
		});
		const subMenu3Item3SubMenuItem3 = canvas.getByRole(ROLES.navigationItem, {
			name: "Sub Sub Item 3",
		});

		expect(menu).toBeInTheDocument();
		expect(item3).toBeInTheDocument();

		await userEvent.click(item2);
		await userEvent.click(item3);

		expect(testClickHandler).toHaveBeenCalledWith(expect.objectContaining({ target: item2 }));
		expect(testClickHandler).toHaveBeenCalledWith(expect.objectContaining({ target: item3 }));
		expect(subMenu2).toBeInTheDocument();
		expect(subMenu3).toBeInTheDocument();
		expect(subMenu2).toHaveClass("grid-rows-[1fr]");
		expect(subMenu3).toHaveClass("grid-rows-[1fr]");
		expect(subMenu3Item3).toBeInTheDocument();

		await userEvent.click(subMenu3Item3);

		expect(testClickHandler).toHaveBeenCalledWith(
			expect.objectContaining({ target: subMenu3Item3 }),
		);
		expect(subMenu3Item3SubMenu).toBeInTheDocument();
		expect(subMenu3Item3SubMenu).toHaveClass("grid-rows-[1fr]");
		expect(subMenu3Item3SubMenuItem3).toBeInTheDocument();

		await userEvent.click(subMenu3Item3SubMenuItem3);

		expect(testClickHandler).toHaveBeenCalledWith(
			expect.objectContaining({ target: subMenu3Item3SubMenuItem3 }),
		);
		expect(subMenu3Item3SubMenuItem3).toHaveClass("bg-black-5");
	},
};
