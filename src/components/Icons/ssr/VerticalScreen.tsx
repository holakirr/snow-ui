import { forwardRef } from "react";
import {
	CustomIconBase,
	VerticalScreenWeights,
	type CustomIconProps,
} from "..";

export const VerticalScreenIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={VerticalScreenWeights} />
	),
);
