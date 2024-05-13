import type { CustomIconProps } from "@types";
import { forwardRef } from "react";
import { XLSXWeights } from "../defs";
import { CustomIconBase } from "../lib";

const XLSXIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={XLSXWeights} />
));

XLSXIcon.displayName = "XLSXIcon";
export { XLSXIcon };
