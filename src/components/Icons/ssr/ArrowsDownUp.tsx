import { forwardRef } from "react";
import { ArrowsDownUpWeights, CustomIconBase, type CustomIconProps } from "..";

export const ArrowsDownUpIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={ArrowsDownUpWeights} />
	),
);
