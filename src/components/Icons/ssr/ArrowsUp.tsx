import { forwardRef } from "react";
import { ArrowsUpWeights, CustomIconBase, type CustomIconProps } from "..";

const ArrowsUpIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={ArrowsUpWeights} />
	),
);

ArrowsUpIcon.displayName = "ArrowsUpIcon";
export { ArrowsUpIcon };
