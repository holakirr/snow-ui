import { useEffect, useState } from "react";
import { Text, type TextProps } from "../Text";
import { Tooltip, type TooltipProps } from "../Tooltip";

/**
 * Props for the Abbr component.
 */
type AbbrProps = React.ComponentProps<"abbr"> &
	TextProps<"abbr"> & {
		/**
		 * Props for the Tooltip component.
		 */
		tooltipProps: TooltipProps;
		/**
		 * Delay in milliseconds before showing the tooltip.
		 * Default value is 500 milliseconds.
		 */
		delay?: number;
	};

/**
 * Abbr component displays an abbreviation with a tooltip.
 */
const Abbr = ({ tooltipProps, delay, children, ...props }: AbbrProps) => {
	let timeout: ReturnType<typeof setTimeout> | undefined = undefined;
	const [showTooltip, setShowTooltip] = useState(false);

	/**
	 * Handles the mouse enter event.
	 * Starts a timeout to show the tooltip after the specified delay.
	 */
	const handleMouseEnter = () => {
		timeout = setTimeout(() => {
			setShowTooltip(true);
		}, delay || 500);

		return () => clearTimeout(timeout);
	};

	/**
	 * Handles the mouse out event.
	 * Clears the timeout and hides the tooltip.
	 */
	const handleMouseOut = () => {
		clearTimeout(timeout);
		setShowTooltip(false);
	};

	useEffect(() => {
		return () => {
			clearTimeout(timeout);
		};
	}, [timeout]);

	return (
		<Tooltip {...tooltipProps} visible={showTooltip}>
			<Text
				onMouseEnter={handleMouseEnter}
				onMouseOut={handleMouseOut}
				as="abbr"
				{...props}
				title=""
			>
				{children}
			</Text>
		</Tooltip>
	);
};

Abbr.displayName = "Abbr";
export { Abbr };
