import { forwardRef } from "react";
import {
	CustomIconBase,
	type CustomIconProps,
	VerticalScreenWeights,
} from "..";

const VerticalScreenIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={VerticalScreenWeights} />
	),
);

VerticalScreenIcon.displayName = "VerticalScreenIcon";
export { VerticalScreenIcon };
