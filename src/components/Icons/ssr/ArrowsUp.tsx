import { forwardRef } from "react";
import { ArrowsUpWeights, CustomIconBase, type CustomIconProps } from "..";

export const ArrowsUpIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={ArrowsUpWeights} />
	),
);
