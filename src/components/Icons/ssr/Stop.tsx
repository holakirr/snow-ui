import { CustomIconBase, StopWeights } from "@components";
import type { CustomIconProps } from "@utils";
import { forwardRef } from "react";

const StopIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={StopWeights} />
));

StopIcon.displayName = "StopIcon";
export { StopIcon };
