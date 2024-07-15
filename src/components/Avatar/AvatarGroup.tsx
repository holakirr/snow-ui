import { type VariantProps, cva } from "class-variance-authority";
import { Children, type ReactElement } from "react";
import { twMerge } from "tailwind-merge";
import { ROLES } from "../../constants";
import { Avatar } from "./Avatar";

/**
 * Props for the AvatarGroup component.
 */
type AvatarGroupProps = React.ComponentProps<"div"> & {
	/**
	 * The maximum number of avatars to display.
	 * @default 3
	 */
	limit?: number;

	/**
	 * The direction in which the avatars should be displayed.
	 * @default "row"
	 */
	direction?: VariantProps<typeof AvatarGroupClasses>["direction"];
};

const AvatarGroupClasses = cva("p-2", {
	variants: {
		direction: {
			row: "flex flex-row",
			grid: "grid grid-rows-2 grid-flow-col",
		},
	},
	defaultVariants: {
		direction: "row",
	},
});

const AvatarGroupItem = ({
	inGrid,
	children,
	...props
}: React.ComponentProps<"div"> & { inGrid?: boolean }) => (
	<div
		className={twMerge(
			"rounded-full border-2 border-white-100 -m-2 z-0 hover:z-10 transition-all",
			inGrid && "-m-1",
		)}
		{...props}
	>
		{children}
	</div>
);

/**
 * AvatarGroup component displays a group of avatars.
 */
const AvatarGroup = ({ children, limit = 3, direction, ...props }: AvatarGroupProps) => {
	const items = Children.toArray(children);
	const itemsToShow = items.slice(0, limit);
	const itemsNotShown = items.slice(limit).length;
	const isInGrid = direction === "grid";

	return (
		<div role={ROLES.region} className={AvatarGroupClasses({ direction })} {...props}>
			{itemsToShow.map((item) => (
				<AvatarGroupItem inGrid={isInGrid} key={(item as ReactElement).key}>
					{item}
				</AvatarGroupItem>
			))}
			{itemsNotShown > 0 && (
				<AvatarGroupItem inGrid={isInGrid}>
					<Avatar name={`+ ${itemsNotShown}`} className="text-xs text-white-100" />
				</AvatarGroupItem>
			)}
		</div>
	);
};

AvatarGroup.displayName = "AvatarGroup";
export { AvatarGroup };
