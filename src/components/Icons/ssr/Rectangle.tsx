import { forwardRef } from "react";
import { CustomIconBase, RectangleWeights, type CustomIconProps } from "..";

export const RectangleIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={RectangleWeights} />
	),
);
