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
	};

/**
 * Abbr component displays an abbreviation with a tooltip.
 */
const Abbr = ({ tooltipProps, children, ...props }: AbbrProps) => (
	<Tooltip {...tooltipProps}>
		<Text as="abbr" {...props} title="">
			{children}
		</Text>
	</Tooltip>
);

Abbr.displayName = "Abbr";
export { Abbr };
