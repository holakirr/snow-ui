import { forwardRef } from "react";
import { CustomIconBase, type CustomIconProps, TXTWeights } from "..";

const TXTIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={TXTWeights} />
));

TXTIcon.displayName = "TXTIcon";
export { TXTIcon };
