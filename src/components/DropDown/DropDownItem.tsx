import { KBD, SearchIcon, Text } from "@components";
import { ROLES } from "@constants";
import { twMerge } from "tailwind-merge";

export type DropDownItemType = {
	img?: JSX.Element;
	title: string;
	href: string;
	subtitle?: string;
	keyBindings?: string[];
};

type DropDownItemProps = React.ComponentProps<"a"> & DropDownItemType;

const DropDownItem = ({
	href,
	img: Image,
	title,
	subtitle,
	keyBindings,
	className,
	ref,
}: DropDownItemProps) => (
	<li
		className="list-none w-full rounded-2xl hover:bg-black-5 focus:bg-black-5"
		role={ROLES.dropdownItem}
	>
		<a
			href={href}
			tabIndex={0}
			ref={ref}
			className={twMerge("flex items-center justify-between p-4 gap-2", className)}
		>
			<div className={twMerge("flex gap-2 items-center", subtitle && "items-start")}>
				{Image ? (
					Image
				) : (
					<SearchIcon
						size={16}
						weight="regular"
						alt={`Search icon for ${title}`}
						className="fill-black-100"
					/>
				)}
				<div className="flex flex-col">
					<Text as="p" size={14} className="text-black-100">
						{title}
					</Text>
					<Text as="span" size={14} className="text-black-40">
						{subtitle}
					</Text>
				</div>
			</div>
			{keyBindings && <KBD className="" keyBindings={keyBindings} />}
		</a>
	</li>
);

DropDownItem.displayName = "DropDownItem";
export { DropDownItem };
