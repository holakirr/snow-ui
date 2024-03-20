import { forwardRef } from "react";
import { ArrowsDownWeights, CustomIconBase, type CustomIconProps } from "..";

export const ArrowsDownIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={ArrowsDownWeights} />
	),
);
