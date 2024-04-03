import { forwardRef } from "react";
import { XLSXWeights } from "../defs";
import { CustomIconBase } from "../lib";
import type { CustomIconProps } from "../types";

const XLSXIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={XLSXWeights} />
));

XLSXIcon.displayName = "XLSXIcon";
export { XLSXIcon };
