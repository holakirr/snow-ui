import { forwardRef } from "react";
import { StopWeights } from "../defs";
import { CustomIconBase } from "../lib";
import type { CustomIconProps } from "../types";

const StopIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={StopWeights} />
));

StopIcon.displayName = "StopIcon";
export { StopIcon };
