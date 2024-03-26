import { type ComponentProps, forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import { Text } from "..";

export type BadgeProps = ComponentProps<"span"> & {
	text?: string;
};

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
	({ text, className }, ref) => (
		<Text
			as="span"
			size={12}
			className={twMerge(
				"bg-secondary-purple rounded-full w-[6px] h-[6px] block text-center transition-all z-10",
				text && "w-auto h-auto text-black-100 px-[6px] py-[1px]",
				className,
			)}
			ref={ref}
		>
			{text}
		</Text>
	),
);

Badge.displayName = "Badge";
export { Badge };
