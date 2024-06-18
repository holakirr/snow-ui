import { useEffect, useState } from "react";
import { Text, type TextProps } from "../Text";
import { Tooltip, type TooltipProps } from "../Tooltip";

type AbbrProps = React.ComponentProps<"abbr"> &
	TextProps<"abbr"> & {
		tooltipProps: TooltipProps;
		delay?: number;
	};

const Abbr = ({ tooltipProps, delay, children, ...props }: AbbrProps) => {
	let timeout: ReturnType<typeof setTimeout> | undefined = undefined;
	const [showTooltip, setShowTooltip] = useState(false);

	const handleMouseEnter = () => {
		timeout = setTimeout(() => {
			setShowTooltip(true);
		}, delay || 500);

		return () => clearTimeout(timeout);
	};

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
