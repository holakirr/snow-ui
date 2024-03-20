import { forwardRef } from "react";
import { CustomIconBase, type CustomIconProps, XLSXWeights } from "..";

const XLSXIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={XLSXWeights} />
));

XLSXIcon.displayName = "XLSXIcon";
export { XLSXIcon };
