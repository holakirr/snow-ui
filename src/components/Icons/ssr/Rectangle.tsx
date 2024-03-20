import { forwardRef } from "react";
import { CustomIconBase, type CustomIconProps, RectangleWeights } from "..";

const RectangleIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={RectangleWeights} />
	),
);

RectangleIcon.displayName = "RectangleIcon";
export { RectangleIcon };
