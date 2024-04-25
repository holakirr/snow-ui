import { NavigationItem } from "@components";
import { NAVIGATION_ITEM_HEIGHT, ROLES } from "@constants";
import type { NavigationItemType } from "@utils";
import { type ComponentProps, type ReactEventHandler, forwardRef } from "react";

type NavigationSubMenuProps = {
	items: NavigationItemType[];
	opened: boolean;
	onItemClick?: ReactEventHandler<HTMLLIElement>;
} & ComponentProps<"menu">;

const getAllItemsCount = (items: NavigationItemType[]): number =>
	items.reduce((acc, item) => {
		if (item.items) {
			return acc + getAllItemsCount(item.items) + 1;
		}
		return acc + 1;
	}, 0);

const getMaxHeight = (items: NavigationItemType[]): number =>
	items.reduce((acc, item) => {
		if (item.items) {
			return acc + getMaxHeight(item.items) + NAVIGATION_ITEM_HEIGHT;
		}
		return acc + NAVIGATION_ITEM_HEIGHT;
	}, 0);

const NavigationSubMenu = forwardRef<HTMLMenuElement, NavigationSubMenuProps>(
	({ items, opened, onItemClick, ...props }, ref) => (
		<menu
			ref={ref}
			className="flex flex-col w-full ps-5 overflow-hidden h-auto gap-1"
			style={{
				maxHeight: opened ? getMaxHeight(items) : 0,
				transition: `all ${getAllItemsCount(items) * 50}ms`,
			}}
			role={ROLES.navigationSubMenu}
			{...props}
		>
			{items.map((item) => (
				<NavigationItem key={item.id} {...item} onClick={onItemClick} />
			))}
		</menu>
	),
);

NavigationSubMenu.displayName = "NavigationSubMenu";
export { NavigationSubMenu };
