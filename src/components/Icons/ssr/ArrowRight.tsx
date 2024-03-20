import { forwardRef } from "react";
import { ArrowRightWeights, CustomIconBase, type CustomIconProps } from "..";

const ArrowRightIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={ArrowRightWeights} />
	),
);

ArrowRightIcon.displayName = "ArrowRightIcon";
export { ArrowRightIcon };
