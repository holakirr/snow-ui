import { Fragment } from "react";
import { twMerge } from "tailwind-merge";
import { ROLES, TEXT_SIZES } from "../../constants";
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

const Breadcrumbs = ({ items, separator = "/", className, ref, ...props }: BreadcrumbsProps) => {
	const hasActiveItems = items.some((item) => item.active);
	return (
		<nav
			ref={ref}
			role={ROLES.navigation}
			className={twMerge("flex flex-row gap-2 items-center", className)}
			{...props}
		>
			{items.map((item, i) => (
				<Fragment key={item.id}>
					<BreadcrumbsItem
						active={item.active || (!hasActiveItems && i === items.length - 1)}
						{...item}
					/>
					{i < items.length - 1 && separator && (
						<Text as="span" size={TEXT_SIZES[14]} className="text-black-40" aria-hidden="true">
							{separator}
						</Text>
					)}
				</Fragment>
			))}
		</nav>
	);
};

Breadcrumbs.displayName = "Breadcrumbs";
export { Breadcrumbs };
