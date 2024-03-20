import { forwardRef } from "react";
import {
	CustomIconBase,
	FourPointedStarWeights,
	type CustomIconProps,
} from "..";

export const FourPointedStarIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={FourPointedStarWeights} />
	),
);
