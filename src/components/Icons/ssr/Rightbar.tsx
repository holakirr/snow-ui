import { forwardRef } from "react";
import { CustomIconBase, RightbarWeights, type CustomIconProps } from "..";

export const RightbarIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={RightbarWeights} />
	),
);
