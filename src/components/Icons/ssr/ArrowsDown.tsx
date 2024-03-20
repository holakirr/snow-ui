import { forwardRef } from "react";
import { ArrowsDownWeights, CustomIconBase, type CustomIconProps } from "..";

const ArrowsDownIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={ArrowsDownWeights} />
	),
);

ArrowsDownIcon.displayName = "ArrowsDownIcon";
export { ArrowsDownIcon };
