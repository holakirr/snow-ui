import { CustomIconBase, XLSXWeights } from "@components";
import type { CustomIconProps } from "@types";
import { forwardRef } from "react";

const XLSXIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={XLSXWeights} />
));

XLSXIcon.displayName = "XLSXIcon";
export { XLSXIcon };
