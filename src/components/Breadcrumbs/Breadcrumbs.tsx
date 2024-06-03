import { BreadcrumbsItem, Text } from "@components";
import { ROLES } from "@constants";
import type { BreadcrumbType } from "@types";
import { Fragment } from "react";

type BreadcrumbsProps = React.ComponentProps<"nav"> & {
	breadcrumbs: BreadcrumbType[];
	onItemSelect: (id: string) => void;
	separator?: string;
};

const Breadcrumbs = ({
	breadcrumbs,
	onItemSelect,
	separator = "/",
	ref,
	...props
}: BreadcrumbsProps) => (
	<nav ref={ref} role={ROLES.breadcrumbs} {...props}>
		{breadcrumbs.map((item, index) => (
			<Fragment key={item.id}>
				<BreadcrumbsItem
					{...item}
					onClick={() => onItemSelect(item.id)}
					active={index === breadcrumbs.length - 1}
				/>
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
