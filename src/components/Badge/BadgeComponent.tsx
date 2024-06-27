import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";
import { ROLES } from "../../constants";
import { Text } from "../Text";

/**
 * Props for the BadgeComponent.
 */
export type BadgeComponentProps = ComponentProps<"span"> & {
	/**
	 * The text to be displayed inside the badge.
	 */
	content?: string;
};

export const BadgeComponent = ({ content, className, ref }: BadgeComponentProps) => (
	<Text
		as="span"
		size={12}
		role={ROLES.badge}
		className={twMerge(
			"bg-secondary-purple rounded-full w-[6px] h-[6px] block text-center transition-all z-10",
			content && "w-auto h-auto text-black-100 px-[6px] py-[1px]",
			className,
		)}
		ref={ref}
	>
		{content}
	</Text>
);
