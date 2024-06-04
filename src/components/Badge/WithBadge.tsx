import { Badge } from "@components";
import { twMerge } from "tailwind-merge";

type WithBadgeProps = React.ComponentProps<"div"> & {
	text?: string;
};

const WithBadge = ({ text, children, ref }: WithBadgeProps) => (
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
);

WithBadge.displayName = "WithBadge";
export { WithBadge };
