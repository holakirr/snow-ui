import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import { Badge, type BadgeProps } from ".";

const WithBadge = forwardRef<HTMLDivElement, BadgeProps>(
	({ text, children }) => (
		<div className="relative">
			{children}
			<Badge
				text={text}
				className={twMerge(
					"absolute -top-[1px] left-full -translate-x-2",
					text && "-top-[6px] -translate-x-1/2",
				)}
			/>
		</div>
	),
);

WithBadge.displayName = "WithBadge";
export { WithBadge };
