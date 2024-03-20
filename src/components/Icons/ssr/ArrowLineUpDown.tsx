import { forwardRef } from "react";
import {
	ArrowLineUpDownWeights,
	CustomIconBase,
	type CustomIconProps,
} from "..";

export const ArrowLineUpDownIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={ArrowLineUpDownWeights} />
	),
);
