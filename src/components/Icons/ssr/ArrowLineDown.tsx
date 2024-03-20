import { forwardRef } from "react";
import { ArrowLineDownWeights, CustomIconBase, type CustomIconProps } from "..";

const ArrowLineDownIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={ArrowLineDownWeights} />
	),
);

ArrowLineDownIcon.displayName = "ArrowLineDownIcon";
export { ArrowLineDownIcon };
