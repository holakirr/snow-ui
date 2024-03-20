import { forwardRef } from "react";
import {
	CustomIconBase,
	type CustomIconProps,
	FourLeafCloverWeights,
} from "..";

const FourLeafCloverIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={FourLeafCloverWeights} />
	),
);

FourLeafCloverIcon.displayName = "FourLeafCloverIcon";
export { FourLeafCloverIcon };
