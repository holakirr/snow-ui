import { twMerge } from "tailwind-merge";
import { ROLES } from "../../constants";
import type { NavigationItemType } from "../../types";
import { NavigationItem } from "./NavigationItem";

/**
 * Props for the NavigationMenu component.
 */
type NavigationMenuProps = React.ComponentProps<"menu"> & {
	/**
	 * An array of navigation items.
	 */
	items: NavigationItemType[];

	/**
	 * Indicates whether the menu is opened or closed.
	 */
	opened: boolean;

	/**
	 * Event handler for when an item in the menu is clicked.
	 */
	onItemClick?: React.MouseEventHandler<HTMLLIElement>;
};

/**
 * NavigationMenu component displays a menu with a list of navigation items.
 */
const NavigationMenu = ({
	items,
	opened,
	onItemClick,
	className,
	title,
	ref,
	...props
}: NavigationMenuProps) => (
	<menu
		ref={ref}
		className={twMerge(
			"grid w-full ps-5 overflow-hidden gap-1 transition-[grid-template-rows] grid-rows-[0fr] duration-500",
			opened && "grid-rows-[1fr]",
			className,
		)}
		role={ROLES.tree}
		aria-label={`Navigation Menu ${title}`}
		{...props}
	>
		<div className="min-h-0">
			{items.map((item) => (
				<NavigationItem key={item.id} {...item} onClick={onItemClick} />
			))}
		</div>
	</menu>
);

NavigationMenu.displayName = "NavigationMenu";
export { NavigationMenu };
