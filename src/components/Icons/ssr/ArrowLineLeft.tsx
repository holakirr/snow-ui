import { forwardRef } from "react";
import { ArrowLineLeftWeights, CustomIconBase, type CustomIconProps } from "..";

export const ArrowLineLeftIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={ArrowLineLeftWeights} />
	),
);
