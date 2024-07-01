import { cva } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import { ROLES } from "../../constants";
import type { PopoverContentType } from "../../types";

type PopoverProps = React.ComponentProps<"div"> & PopoverContentType;

const popoverContentClasses = cva("transition-all absolute z-100", {
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

export const PopoverContent = ({ position, className, ...props }: PopoverProps) => (
	<div
		data-popover
		role={ROLES.tooltip}
		className={twMerge(popoverContentClasses({ position }), className)}
		{...props}
	/>
);
