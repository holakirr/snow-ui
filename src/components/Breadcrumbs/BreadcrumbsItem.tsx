import { Button } from "@components";
import { ROLES } from "@constants";
import type { Breadcrumb } from "@utils";
import { type ComponentProps, forwardRef } from "react";

type BreadcrumbsItemProps = Breadcrumb &
	ComponentProps<"button"> & {
		active?: boolean;
	};

const BreadcrumbsItem = forwardRef<HTMLButtonElement, BreadcrumbsItemProps>(
	({ active, id, label, ...props }, ref) => (
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
	),
);

BreadcrumbsItem.displayName = "BreadcrumbsItem";
export { BreadcrumbsItem };
