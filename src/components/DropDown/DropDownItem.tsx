import { twMerge } from "tailwind-merge";
import { ROLES } from "../../constants";
import { KBD } from "../KBD";
import { Text } from "../Text";

export type DropDownItemType = {
	startContent?: JSX.Element;
	title?: string;
	description?: string;
	keyBindings?: string[];
};

type DropDownItemProps = React.ComponentProps<"li"> & DropDownItemType;

const DropDownItem = ({
	startContent,
	title,
	description,
	keyBindings,
	className,
	children,
	ref,
}: DropDownItemProps) => (
	<li
		role={ROLES.dropdownItem}
		ref={ref}
		className={twMerge(
			"flex items-center justify-between p-2 gap-4 list-none w-full rounded-lg hover:bg-black-5 focus:bg-black-5 cursor-pointer",
			className,
		)}
	>
		<div className={twMerge("flex gap-2 items-center", description && "items-start")}>
			{startContent}
			<div className="flex flex-col text-nowrap text-sm">
				{children || (
					<Text as="p" className="text-black-100">
						{title}
					</Text>
				)}
				{description && (
					<Text as="span" size={14} className="text-black-40">
						{description}
					</Text>
				)}
			</div>
		</div>
		{keyBindings && <KBD className="" keyBindings={keyBindings} />}
	</li>
);

DropDownItem.displayName = "DropDownItem";
export { DropDownItem };
