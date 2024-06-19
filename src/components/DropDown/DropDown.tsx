import { twMerge } from "tailwind-merge";
import { ROLES } from "../../constants";
import { Text } from "../Text";
import { DropDownItem, type DropDownItemType } from "./DropDownItem";

type DropDownListType = {
	/**
	 * The title of the dropdown list.
	 * @example "Account"
	 **/
	title: string;
	items: DropDownItemType[];
};

/**
 * Represents the type definition for a DropDown component.
 */
export type DropDownType = {
	lists: DropDownListType[];
};

type DropDownProps = DropDownType & React.ComponentProps<"div">;

const DropDown = ({ lists, className, ref }: DropDownProps) => (
	<div
		ref={ref}
		aria-label="dropdown"
		className={twMerge("flex flex-col gap-4 w-full", className)}
		role={ROLES.dropdown}
	>
		{lists.map((list) => (
			<div key={list.title} className="flex flex-col gap-1">
				<Text as="p" size={14} className="px-4 py-1 text-black-40">
					{list.title}
				</Text>
				<ul className="flex flex-col gap-1" role={ROLES.dropdownList}>
					{list.items.map((item) => (
						<DropDownItem key={item.title} {...item} />
					))}
				</ul>
			</div>
		))}
	</div>
);

DropDown.displayName = "DropDown";
export { DropDown };
