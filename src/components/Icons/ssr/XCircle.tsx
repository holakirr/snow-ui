import type { CustomIconProps } from "@types";
import { forwardRef } from "react";
import { XCircleWeights } from "../defs";
import { CustomIconBase } from "../lib";

const XCircleIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={XCircleWeights} />
));

XCircleIcon.displayName = "XCircleIcon";
export { XCircleIcon };
