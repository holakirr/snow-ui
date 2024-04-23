import { BreadcrumbsItem, Text } from "@components";
import { ROLES } from "@constants";
import type { Breadcrumb } from "@utils";
import { type ComponentProps, Fragment, forwardRef } from "react";

type BreadcrumbsProps = {
	breadcrumbs: Breadcrumb[];
	onItemSelect: (id: string) => void;
	separator?: string;
};

const Breadcrumbs = forwardRef<
	HTMLMenuElement,
	BreadcrumbsProps & ComponentProps<"nav">
>(({ breadcrumbs, onItemSelect, separator = "/", ...props }, ref) => (
	<nav ref={ref} role={ROLES.breadcrumbs} {...props}>
		{breadcrumbs.map((item, index) => (
			<Fragment key={item.id}>
				<BreadcrumbsItem
					{...item}
					onClick={() => onItemSelect(item.id)}
					active={index === breadcrumbs.length - 1}
				/>
				{index < breadcrumbs.length - 1 && separator && (
					<Text
						as="span"
						size={14}
						className="text-black-40"
						aria-hidden="true"
					>
						{separator}
					</Text>
				)}
			</Fragment>
		))}
	</nav>
));

Breadcrumbs.displayName = "Breadcrumbs";
export { Breadcrumbs };
