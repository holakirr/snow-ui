import { type VariantProps, cva } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import { ROLES } from "../../constants";
import type { PopoverContentType } from "../../types";

type PopoverProps = React.ComponentProps<"div"> &
	PopoverContentType &
	VariantProps<typeof popoverContentClasses> & {
		/**
		 * Whether the popover is visible or not.
		 */
		visible: boolean;
	};

const popoverContentClasses = cva("absolute z-100", {
	variants: {
		position: {
			top: "bottom-full -translate-y-1 left-1/2 -translate-x-1/2",
			bottom: "top-full translate-y-1 left-1/2 -translate-x-1/2",
			left: "right-full translate-x-1 top-1/2 -translate-y-1/2",
			right: "left-full -translate-x-1 top-1/2 -translate-y-1/2",
		},
	},
	defaultVariants: {
		position: "bottom",
	},
});

/**
 * PopoverContent component displays the content of the popover.
 */
export const PopoverContent = ({
	position,
	visible,
	className,
	children,
	...props
}: PopoverProps) => (
	<div
		data-popover
		role={ROLES.tooltip}
		className={twMerge(popoverContentClasses({ position }), className)}
		{...props}
	>
		<div
			className={twMerge(
				"grid transition-[grid-template-rows] overflow-hidden",
				visible ? "grid-rows-[1fr] pointer-events-auto" : "grid-rows-[0fr] pointer-events-none",
			)}
		>
			<div className="transition-all min-h-0">{children}</div>
		</div>
	</div>
);
