import React, { Children } from "react";
import { twMerge } from "tailwind-merge";
import type { PopoverType } from "../../types";
import { PopoverContent } from "./PopoverContent";

type PopoverProps = React.ComponentProps<"div"> &
	PopoverType & {
		/**
		 * Should contain 2 children :
		 * 1. The trigger element for the popover.
		 * 2. The content of the popover.
		 */
		children: React.ReactNode[];
	};

const Popover = ({ visible, wrapperClassName, children, ...props }: PopoverProps) => {
	const [trigger, content] = Children.toArray(children);
	return (
		<div className={twMerge("relative", wrapperClassName)}>
			{trigger}
			{visible ? (
				React.isValidElement(content) && content.props.position ? (
					content
				) : (
					<PopoverContent {...props}>{content}</PopoverContent>
				)
			) : null}
		</div>
	);
};

Popover.displayName = "Popover";
export { Popover };
