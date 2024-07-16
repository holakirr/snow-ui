import { twMerge } from "tailwind-merge";
import { ROLES, TEXT_SIZES } from "../../constants";
import { KBD } from "../KBD";
import { Text } from "../Text";

export type DropDownItemType = {
	/**
	 * The content to be displayed at the start of the item.
	 * This can be an icon or any other element.
	 * @default null
	 * @example <Icon name="icon-name" />
	 * */
	startContent?: JSX.Element;

	/**
	 * The title of the item.
	 * @example "Item Title"
	 * */
	title?: string;

	/**
	 * The description of the item.
	 * @example "Item Description"
	 * */
	description?: string;

	/**
	 * The key bindings for the item.
	 * @example ["Ctrl", "Alt", "T"]
	 * */
	keyBindings?: string[];
};

type DropDownItemProps = React.ComponentProps<"li"> & DropDownItemType;

/**
 * DropDownItem component displays an item in a dropdown.
 */
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
		role={ROLES.option}
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
					<Text as="span" size={TEXT_SIZES[14]} className="text-black-40">
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
