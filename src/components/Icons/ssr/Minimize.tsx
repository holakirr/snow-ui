import { forwardRef } from "react";
import { CustomIconBase, MinimizeWeights, type CustomIconProps } from "..";

export const MinimizeIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={MinimizeWeights} />
	),
);
