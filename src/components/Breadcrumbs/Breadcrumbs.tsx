import { Fragment } from "react";
import { twMerge } from "tailwind-merge";
import { ROLES } from "../../constants";
import type { BreadcrumbType } from "../../types";
import { Text } from "../Text";
import { BreadcrumbsItem } from "./BreadcrumbsItem";

/**
 * Props for the Breadcrumbs component.
 */
type BreadcrumbsProps = React.ComponentProps<"nav"> & {
	/**
	 * An array of breadcrumb items.
	 */
	items: BreadcrumbType[];

	/**
	 * The separator string to be displayed between breadcrumbs.
	 */
	separator?: string;
};

const Breadcrumbs = ({ items, separator = "/", className, ref, ...props }: BreadcrumbsProps) => (
	<nav
		ref={ref}
		role={ROLES.breadcrumbs}
		className={twMerge("flex flex-row gap-2 items-center", className)}
		{...props}
	>
		{items.map((item, i) => (
			<Fragment key={item.id}>
				<BreadcrumbsItem
					active={
						items.filter((itm) => itm.active).length > 0 ? item.active : i === items.length - 1
					}
					{...item}
				/>
				{i < items.length - 1 && separator && (
					<Text as="span" size={14} className="text-black-40" aria-hidden="true">
						{separator}
					</Text>
				)}
			</Fragment>
		))}
	</nav>
);

Breadcrumbs.displayName = "Breadcrumbs";
export { Breadcrumbs };
