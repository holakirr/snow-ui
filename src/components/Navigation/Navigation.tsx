import type { ReactEventHandler } from "react";
import { twMerge } from "tailwind-merge";
import { ROLES, TEXT_SIZES } from "../../constants";
import type { NavigationItemType } from "../../types";
import { Text } from "../Text";
import { NavigationMenu } from "./NavigationMenu";

/**
 * Props for the Navigation component.
 */
type NavigationProps = React.ComponentProps<"nav"> & {
	/**
	 * The title of the navigation.
	 */
	title?: string;
	/**
	 * An array of navigation items.
	 */
	items: NavigationItemType[];
	/**
	 * Event handler for when a navigation item is clicked.
	 */
	onItemClick: ReactEventHandler<HTMLLIElement>;
};

/**
 * Navigation component displays a list of navigation items.
 */
const Navigation = ({ title, items, onItemClick, className, ref, ...props }: NavigationProps) => (
	<nav
		ref={ref}
		role={ROLES.navigation}
		className={twMerge("grid gap-1", className)}
		aria-label={`Navigation ${title}`}
		{...props}
	>
		{title && (
			<Text size={TEXT_SIZES[14]} className="py-1 px-3 text-black-40">
				{title}
			</Text>
		)}
		<NavigationMenu className="ps-0" items={items} opened onItemClick={onItemClick} />
	</nav>
);

Navigation.displayName = "Navigation";
export { Navigation };
