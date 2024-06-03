import { NavigationMenu, Text } from "@components";
import { ROLES } from "@constants";
import type { NavigationItemType } from "@types";
import { type ComponentProps, type ReactEventHandler, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

type NavigationProps = ComponentProps<"nav"> & {
	title?: string;
	items: NavigationItemType[];
	onItemClick: ReactEventHandler<HTMLLIElement>;
};

const Navigation = forwardRef<HTMLElement, NavigationProps>(
	({ title, items, onItemClick, className, ...props }, ref) => (
		<nav
			ref={ref}
			role={ROLES.navigation}
			className={twMerge("grid gap-1", className)}
			aria-label={`Navigation ${title}`}
			{...props}
		>
			{title && (
				<Text size={14} className="py-1 px-3 text-black-40">
					{title}
				</Text>
			)}
			<NavigationMenu className="ps-0" items={items} opened onItemClick={onItemClick} />
		</nav>
	),
);

Navigation.displayName = "Navigation";
export { Navigation };
