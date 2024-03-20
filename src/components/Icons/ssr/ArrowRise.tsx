import { forwardRef } from "react";
import { ArrowRiseWeights, CustomIconBase, type CustomIconProps } from "..";

export const ArrowRiseIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={ArrowRiseWeights} />
	),
);
