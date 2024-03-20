import { forwardRef } from "react";
import { ArrowRightWeights, CustomIconBase, type CustomIconProps } from "..";

export const ArrowRightIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={ArrowRightWeights} />
	),
);
