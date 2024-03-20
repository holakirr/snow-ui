import { forwardRef } from "react";
import {
	CustomIconBase,
	FourLeafCloverWeights,
	type CustomIconProps,
} from "..";

export const FourLeafCloverIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={FourLeafCloverWeights} />
	),
);
