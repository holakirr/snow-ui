import { forwardRef } from "react";
import { CustomIconBase, MaximizeWeights, type CustomIconProps } from "..";

export const MaximizeIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={MaximizeWeights} />
	),
);
