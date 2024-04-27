import { NavigationItem } from "@components";
import { ROLES } from "@constants";
import type { NavigationItemType } from "@types";
import { type ComponentProps, type ReactEventHandler, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

type NavigationMenuProps = {
	items: NavigationItemType[];
	opened: boolean;
	onItemClick: ReactEventHandler<HTMLLIElement>;
} & ComponentProps<"menu">;

const NavigationMenu = forwardRef<HTMLMenuElement, NavigationMenuProps>(
	({ items, opened, onItemClick, className, title, ...props }, ref) => (
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
					<NavigationItem key={item.id} {...item} onClick={onItemClick} />
				))}
			</div>
		</menu>
	),
);

NavigationMenu.displayName = "NavigationMenu";
export { NavigationMenu };
