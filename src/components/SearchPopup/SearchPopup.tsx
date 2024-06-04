import { DropDown, type DropDownType, Input, Line, SearchIcon } from "@components";
import { ROLES, STATUSES } from "@constants";
import { twMerge } from "tailwind-merge";

type SearchPopupProps = React.ComponentProps<"input"> & {
	progress?: boolean;
	dropdown?: DropDownType;
};

const SearchPopup = ({ progress, width, dropdown, className, ref, ...props }: SearchPopupProps) => (
	<div
		className={twMerge(
			"flex flex-col p-7 backdrop-blur-[20px] rounded-[32px] bg-white-80 gap-4",
			className,
		)}
		style={{ width }}
		role={ROLES.searchPopup}
	>
		<div className="mb-2">
			<Input
				ref={ref}
				placeholder="Search"
				iconSize={32}
				icon={SearchIcon}
				className={twMerge(
					"border-none p-0 ps-[52px] pe-2 text-2xl focus:ring-0 w-full bg-transparent rounded-lg",
				)}
				iconClassName="left-2 fill-black-100"
				status={progress ? STATUSES.progress : undefined}
				role={ROLES.search}
				{...props}
			/>
		</div>
		<Line className="bg-black-5" />
		{dropdown && <DropDown {...dropdown} />}
	</div>
);

SearchPopup.displayName = "SearchPopup";
export { SearchPopup };
