import { forwardRef } from "react";
import {
	CustomIconBase,
	type CustomIconProps,
	FourPointedStarWeights,
} from "..";

const FourPointedStarIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={FourPointedStarWeights} />
	),
);

FourPointedStarIcon.displayName = "FourPointedStarIcon";
export { FourPointedStarIcon };
