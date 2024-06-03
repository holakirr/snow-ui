import { Badge, type BadgeProps } from "@components";
import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

const WithBadge = forwardRef<HTMLDivElement, BadgeProps>(({ text, children }, ref) => (
	<div className="relative" ref={ref}>
		{children}
		<Badge
			text={text}
			className={twMerge(
				"absolute -top-[1px] left-full -translate-x-2",
				text && "-top-[6px] -translate-x-1/2",
			)}
		/>
	</div>
));

WithBadge.displayName = "WithBadge";
export { WithBadge };
