import type { ReactEventHandler } from "react";
import { twMerge } from "tailwind-merge";
import { ROLES } from "../../constants";
import type { NavigationItemType } from "../../types";
import { Text } from "../Text";
import { NavigationMenu } from "./NavigationMenu";

type NavigationProps = React.ComponentProps<"nav"> & {
	title?: string;
	items: NavigationItemType[];
	onItemClick: ReactEventHandler<HTMLLIElement>;
};

const Navigation = ({ title, items, onItemClick, className, ref, ...props }: NavigationProps) => (
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
);

Navigation.displayName = "Navigation";
export { Navigation };
