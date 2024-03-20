import { forwardRef } from "react";
import { ArrowRiseWeights, CustomIconBase, type CustomIconProps } from "..";

const ArrowRiseIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={ArrowRiseWeights} />
	),
);

ArrowRiseIcon.displayName = "ArrowRiseIcon";
export { ArrowRiseIcon };
