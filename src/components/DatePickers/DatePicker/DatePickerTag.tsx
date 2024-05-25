import { twMerge } from "tailwind-merge";
import { Tag, type TagProps } from "../../Tag";

export const DatePickerTag = ({ className, ...props }: TagProps) => (
	<Tag className={twMerge("rounded", className)} {...props} />
);
