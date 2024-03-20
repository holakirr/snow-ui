import { forwardRef } from "react";
import { CustomIconBase, XCircleWeights, type CustomIconProps } from "..";

export const XCircleIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={XCircleWeights} />
	),
);
