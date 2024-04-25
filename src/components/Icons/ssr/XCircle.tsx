import { CustomIconBase, XCircleWeights } from "@components";
import type { CustomIconProps } from "@types";
import { forwardRef } from "react";

const XCircleIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={XCircleWeights} />
));

XCircleIcon.displayName = "XCircleIcon";
export { XCircleIcon };
