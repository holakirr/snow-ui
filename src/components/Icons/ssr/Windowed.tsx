import { forwardRef } from "react";
import { CustomIconBase, WindowedWeights, type CustomIconProps } from "..";

export const WindowedIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={WindowedWeights} />
	),
);
