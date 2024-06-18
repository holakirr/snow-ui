import { useState } from "react";
import { Text, type TextProps } from "../Text";
import { Tooltip, type TooltipProps } from "../Tooltip";

type AbbrProps = React.ComponentProps<"abbr"> &
	TextProps<"abbr"> & {
		tooltipProps: TooltipProps;
		delay?: number;
	};

const Abbr = ({ tooltipProps, delay, children, ...props }: AbbrProps) => {
	const [showTooltip, setShowTooltip] = useState(false);

	const handleMouseEnter = () => {
		const timeout = setTimeout(() => {
			setShowTooltip(true);
		}, delay || 500);

		return () => clearTimeout(timeout);
	};

	return (
		<Tooltip {...tooltipProps} visible={showTooltip}>
			<Text
				onMouseEnter={handleMouseEnter}
				onMouseOut={() => setShowTooltip(false)}
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
