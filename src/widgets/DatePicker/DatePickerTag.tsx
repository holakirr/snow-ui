import { Tag, type TagProps } from "@components";
import { twMerge } from "tailwind-merge";

export const DatePickerTag = ({ className, ...props }: TagProps) => (
	<Tag className={twMerge("rounded", className)} {...props} />
);
