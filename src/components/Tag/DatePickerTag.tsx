import { twMerge } from "tailwind-merge";
import { Tag, type TagProps } from "./Tag";

type DatePickerTagProps = TagProps & {
	isActive?: boolean;
};

export const DatePickerTag = ({ className, isActive, ...props }: DatePickerTagProps) => (
	<Tag
		className={twMerge("rounded py-0.5 px-1 bg-transparent", isActive && "bg-black-5", className)}
		aria-selected={isActive}
		{...props}
	/>
);
