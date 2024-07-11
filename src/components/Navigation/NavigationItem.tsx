import { twMerge } from "tailwind-merge";
import { ICON_SIZES, ROLES, TEXT_SIZES } from "../../constants";
import type { NavigationItemType } from "../../types";
import { ArrowLineRightIcon } from "../Icons";
import { Text } from "../Text";
import { NavigationMenu } from "./NavigationMenu";

type NavigationItemProps = React.ComponentProps<"li"> &
	NavigationItemType & {
		/**
		 * Is the navigation item active.
		 */
		active?: boolean;
		/**
		 * Is the navigation item expanded.
		 */
		expanded?: boolean;
	};

const NavigationItem = ({
	label,
	id,
	active,
	expanded,
	icon: Icon,
	items,
	className,
	onClick,
	ref,
	...props
}: NavigationItemProps) => (
	<div className="flex flex-col list-none transition-all gap-1">
		<li
			ref={ref}
			onClick={onClick}
			id={id}
			aria-label={label}
			className={twMerge(
				"p-2 ps-7 has-[svg#arrow-icon]:ps-2 flex items-center gap-1 rounded-xl hover:bg-black-5 cursor-pointer transition-all",
				active && "bg-black-5",
				className,
			)}
			role={ROLES.treeitem}
			{...props}
		>
			{items && (
				<ArrowLineRightIcon
					alt={`Arrow icon for navigation item ${label}`}
					weight="regular"
					size={ICON_SIZES[16]}
					className={twMerge(
						"fill-black-20 transition-all transform rotate-0",
						expanded && "rotate-90",
					)}
					id="arrow-icon"
				/>
			)}
			<div className="flex items-center gap-2">
				{Icon && (
					<Icon size={ICON_SIZES[20]} alt={`Icon ${Icon.displayName}`} className="fill-black-100" />
				)}
				<Text as="p" size={TEXT_SIZES[14]} className="w-fit text-black-100">
					{label}
				</Text>
			</div>
		</li>
		{items && (
			<NavigationMenu items={items} onItemClick={onClick} opened={!!expanded} title={label} />
		)}
	</div>
);

NavigationItem.displayName = "NavigationItem";
export { NavigationItem };
