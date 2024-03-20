import { forwardRef } from "react";
import { CustomIconBase, type CustomIconProps, WindowedWeights } from "..";

const WindowedIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={WindowedWeights} />
	),
);

WindowedIcon.displayName = "WindowedIcon";
export { WindowedIcon };
