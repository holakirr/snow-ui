import { forwardRef } from "react";
import {
	ArrowLineRightWeights,
	CustomIconBase,
	type CustomIconProps,
} from "..";

const ArrowLineRightIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={ArrowLineRightWeights} />
	),
);

ArrowLineRightIcon.displayName = "ArrowLineRightIcon";
export { ArrowLineRightIcon };
