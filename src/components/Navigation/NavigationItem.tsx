import { ArrowLineRightIcon, NavigationMenu, Text } from "@components";
import { ROLES } from "@constants";
import type { NavigationItemType } from "@types";
import { type ComponentProps, type ReactEventHandler, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

type NavigationItemProps = ComponentProps<"li"> &
	NavigationItemType & {
		active?: boolean;
		expanded?: boolean;
		onClick: ReactEventHandler<HTMLLIElement>;
	};

const NavigationItem = forwardRef<HTMLLIElement, NavigationItemProps>(
	(
		{
			label,
			id,
			active,
			expanded,
			icon: Icon,
			items,
			onClick,
			className,
			...props
		},
		ref,
	) => (
		<div className="flex flex-col list-none transition-all gap-1">
			<li
				ref={ref}
				onClick={onClick}
				id={id}
				aria-label={label}
				className={twMerge(
					"p-2 ps-7 has-[svg#arrow-icon]:ps-2 flex items-center gap-1 rounded-xl hover:bg-black-5 cursor-pointer",
					active && "bg-black-5",
					className,
				)}
				role={ROLES.navigationItem}
				{...props}
			>
				{items && (
					<ArrowLineRightIcon
						alt={`Arrow icon for navigation item ${label}`}
						weight="regular"
						size={16}
						className={twMerge(
							"fill-black-20 transition-all transform rotate-0",
							expanded && "rotate-90",
						)}
						id="arrow-icon"
					/>
				)}
				<div className="flex items-center gap-2">
					{Icon && (
						<Icon
							size={20}
							alt={`Icon ${Icon.displayName}`}
							className="fill-black-100"
						/>
					)}
					<Text as="p" size={14} className="w-fit text-black-100">
						{label}
					</Text>
				</div>
			</li>
			{items && (
				<NavigationMenu
					items={items}
					onItemClick={onClick}
					opened={!!expanded}
					title={label}
				/>
			)}
		</div>
	),
);

NavigationItem.displayName = "NavigationItem";
export { NavigationItem };
