import { Fragment } from "react";
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
	breadcrumbs: BreadcrumbType[];

	/**
	 * The separator string to be displayed between breadcrumbs.
	 */
	separator?: string;
};

const Breadcrumbs = ({ breadcrumbs, separator = "/", ref, ...props }: BreadcrumbsProps) => (
	<nav ref={ref} role={ROLES.breadcrumbs} {...props}>
		{breadcrumbs.map((item, index) => (
			<Fragment key={item.id}>
				<BreadcrumbsItem active={index === breadcrumbs.length - 1} {...item} />
				{index < breadcrumbs.length - 1 && separator && (
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
