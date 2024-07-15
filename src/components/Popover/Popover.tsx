import type React from "react";
import { twMerge } from "tailwind-merge";
import type { PopoverContentType } from "../../types";

type PopoverProps = React.ComponentProps<"div"> &
	PopoverContentType & {
		/**
		 * Should contain 2 children :
		 * 1. The trigger element for the popover.
		 * 2. The content of the popover.
		 */
		children: React.ReactNode[];
	};

/**
 * Popover component is a wrapper around PopoverContent component.
 */
const Popover = ({ className, ...props }: PopoverProps) => (
	<div className={twMerge("relative", className)} {...props} />
);

Popover.displayName = "Popover";
export { Popover };
