import { ROLES } from "../../constants";
import type { BreadcrumbType } from "../../types";
import { Button } from "../Button";

/**
 * Represents a single item in the Breadcrumbs component.
 */
type BreadcrumbsItemProps = BreadcrumbType &
	React.ComponentProps<"button"> & {
		active?: boolean;
	};

const BreadcrumbsItem = ({ active, id, label, ref, ...props }: BreadcrumbsItemProps) => (
	<Button
		ref={ref}
		aria-label={label}
		aria-current={active ? "page" : undefined}
		role={ROLES.breadcrumbsItem}
		id={id}
		label={label}
		size="sm"
		className={!active ? "text-black-40" : ""}
		variant="borderless"
		{...props}
	/>
);

BreadcrumbsItem.displayName = "BreadcrumbsItem";
export { BreadcrumbsItem };
