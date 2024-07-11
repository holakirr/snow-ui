import React, { type MouseEventHandler, useEffect, useState } from "react";
import type { PopoverContentType } from "../../types";
import { Popover } from "../Popover";
import { TooltipComponent, type TooltipComponentType } from "./TooltipComponent";

/**
 * Props for the Tooltip component.
 */
export type TooltipProps = React.ComponentProps<"div"> &
	TooltipComponentType &
	PopoverContentType & {
		/**
		 * Additional class name for the wrapper.
		 */
		wrapperClassname?: string;

		/**
		 * Delay in milliseconds before showing the tooltip.
		 * Default value is 500 milliseconds.
		 */
		delay?: number;
	};

const Tooltip = ({
	label,
	kbd,
	position,
	wrapperClassname,
	delay = 500,
	className,
	children,
	ref,
}: TooltipProps) => {
	let timeout: ReturnType<typeof setTimeout> | undefined = undefined;
	const [showTooltip, setShowTooltip] = useState(false);

	/**
	 * Handles the mouse enter event.
	 * Starts a timeout to show the tooltip after the specified delay.
	 */
	const handleMouseEnter = () => {
		timeout = setTimeout(() => {
			setShowTooltip(true);
		}, delay);

		return () => clearTimeout(timeout);
	};

	/**
	 * Handles the mouse out event.
	 * Clears the timeout and hides the tooltip.
	 */
	const handleMouseLeave: MouseEventHandler<HTMLDivElement> = () => {
		setShowTooltip(false);
		clearTimeout(timeout);
	};

	const handleOnBlur = () => {
		setShowTooltip(false);
		clearTimeout(timeout);
	};

	useEffect(() => {
		return () => {
			clearTimeout(timeout);
		};
	}, [timeout]);

	return (
		<Popover position={position} className={wrapperClassname}>
			{React.cloneElement(children as React.ReactElement, {
				"data-trigger": true,
				onMouseEnter: handleMouseEnter,
				onMouseLeave: handleMouseLeave,
				onBlur: handleOnBlur,
			})}
			<TooltipComponent
				visible={showTooltip}
				ref={ref}
				className={className}
				label={label}
				kbd={kbd}
			/>
		</Popover>
	);
};

Tooltip.displayName = "WithTooltip";
export { Tooltip };
