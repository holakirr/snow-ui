import { forwardRef } from "react";
import {
	CustomIconBase,
	HorizontalScreenWeights,
	type CustomIconProps,
} from "..";

export const HorizontalScreenIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={HorizontalScreenWeights} />
	),
);
