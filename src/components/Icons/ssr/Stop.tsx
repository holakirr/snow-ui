import { forwardRef } from "react";
import { CustomIconBase, type CustomIconProps, StopWeights } from "..";

const StopIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={StopWeights} />
));

StopIcon.displayName = "StopIcon";
export { StopIcon };
