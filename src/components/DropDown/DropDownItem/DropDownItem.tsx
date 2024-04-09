import { type ComponentProps, forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import { KBD, SearchIcon, Text } from "../../..";

export type DropDownItemProps = {
	img?: JSX.Element;
	title: string;
	href: string;
	subtitle?: string;
	keyBindings?: string[];
};

type DropDownItemAllProps = ComponentProps<"a"> & DropDownItemProps;

const DropDownItem = forwardRef<HTMLAnchorElement, DropDownItemAllProps>(
	({ href, img: Image, title, subtitle, keyBindings, className }, ref) => (
		<a
			href={href}
			tabIndex={0}
			ref={ref}
			className={twMerge(
				"p-4 w-full rounded-2xl hover:bg-black-5 focus:bg-black-5 flex items-center justify-between",
				className,
			)}
		>
			<div
				className={twMerge(
					"flex gap-2 items-center",
					subtitle && "items-start",
				)}
			>
				{Image ? (
					Image
				) : (
					<SearchIcon
						size={16}
						weight="regular"
						alt={`search icon for ${title}`}
					/>
				)}
				<div className="flex flex-col">
					<Text as="p" size={14}>
						{title}
					</Text>
					<Text as="span" size={14} className="text-black-40">
						{subtitle}
					</Text>
				</div>
			</div>
			{keyBindings && <KBD className="" keyBindings={keyBindings} />}
		</a>
	),
);

DropDownItem.displayName = "DropDownItem";
export { DropDownItem };
