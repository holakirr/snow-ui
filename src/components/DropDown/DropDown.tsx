import { DropDownItem, type DropDownItemProps, Text } from "@components";
import { type ComponentProps, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

type DropDownListProps = {
	title: string;
	items: DropDownItemProps[];
};

export type DropDownProps = {
	lists: DropDownListProps[];
};

type DropDownAllProps = DropDownProps & ComponentProps<"div">;

const DropDown = forwardRef<HTMLDivElement, DropDownAllProps>(
	({ lists, className }, ref) => (
		<div
			ref={ref}
			aria-label="dropdown"
			className={twMerge("flex flex-col gap-4 w-full", className)}
		>
			{lists.map((list) => (
				<div key={list.title} className="flex flex-col gap-1">
					<Text as="p" size={14} className="px-4 py-1 text-black-40">
						{list.title}
					</Text>
					<ul className="flex flex-col gap-1">
						{list.items.map((item) => (
							<DropDownItem key={item.title} {...item} />
						))}
					</ul>
				</div>
			))}
		</div>
	),
);

DropDown.displayName = "DropDown";
export { DropDown };
