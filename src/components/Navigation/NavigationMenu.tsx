import { twMerge } from "tailwind-merge";
import { ROLES } from "../../constants";
import type { NavigationItemType } from "../../types";
import { NavigationItem } from "./NavigationItem";

type NavigationMenuProps = React.ComponentProps<"menu"> & {
	items: NavigationItemType[];
	opened: boolean;
	onItemClick: React.ReactEventHandler<HTMLLIElement>;
};

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
		role={ROLES.navigationMenu}
		aria-label={`Navigation Menu ${title}`}
		{...props}
	>
		<div className="min-h-0">
			{items.map((item) => (
				<NavigationItem key={item.id} {...item} onItemClick={onItemClick} />
			))}
		</div>
	</menu>
);

NavigationMenu.displayName = "NavigationMenu";
export { NavigationMenu };
