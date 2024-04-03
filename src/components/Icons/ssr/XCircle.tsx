import { forwardRef } from "react";
import { XCircleWeights } from "../defs";
import { CustomIconBase } from "../lib";
import type { CustomIconProps } from "../types";

const XCircleIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={XCircleWeights} />
));

XCircleIcon.displayName = "XCircleIcon";
export { XCircleIcon };
