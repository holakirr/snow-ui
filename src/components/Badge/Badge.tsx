import { twMerge } from "tailwind-merge";
import { BadgeComponent } from "./BadgeComponent";

type BadgeProps = React.ComponentProps<"div"> & {
	text?: string;
};

const Badge = ({ text, children, ...props }: BadgeProps) => (
	<div className="relative" {...props}>
		{children}
		<BadgeComponent
			text={text}
			className={twMerge(
				"absolute -top-[1px] left-full -translate-x-2",
				text && "-top-[6px] -translate-x-1/2",
			)}
		/>
	</div>
);

Badge.displayName = "Badge";
export { Badge };
