import { forwardRef } from "react";
import { ArrowLineUpWeights, CustomIconBase, type CustomIconProps } from "..";

const ArrowLineUpIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={ArrowLineUpWeights} />
	),
);

ArrowLineUpIcon.displayName = "ArrowLineUpIcon";
export { ArrowLineUpIcon };
