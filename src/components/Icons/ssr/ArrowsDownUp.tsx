import { forwardRef } from "react";
import { ArrowsDownUpWeights, CustomIconBase, type CustomIconProps } from "..";

const ArrowsDownUpIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={ArrowsDownUpWeights} />
	),
);

ArrowsDownUpIcon.displayName = "ArrowsDownUpIcon";
export { ArrowsDownUpIcon };
