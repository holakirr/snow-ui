import { twMerge } from "tailwind-merge";
import { BadgeComponent } from "./BadgeComponent";

/**
 * Props for the Badge component.
 */
type BadgeProps = React.ComponentProps<"div"> & {
	/**
	 * The text to be displayed inside the badge.
	 */
	content?: string;
};

const Badge = ({ content, children, className, ...props }: BadgeProps) => (
	<div className="relative" {...props}>
		{children}
		<BadgeComponent
			content={content}
			className={twMerge(
				"absolute -top-[1px] left-full -translate-x-2",
				content && "-top-[6px] -translate-x-1/2",
				className,
			)}
		/>
	</div>
);

Badge.displayName = "Badge";
export { Badge };
