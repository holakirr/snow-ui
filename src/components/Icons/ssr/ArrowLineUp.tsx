import { forwardRef } from "react";
import { ArrowLineUpWeights, CustomIconBase, type CustomIconProps } from "..";

export const ArrowLineUpIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={ArrowLineUpWeights} />
	),
);
