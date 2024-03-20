import { forwardRef } from "react";
import { CustomIconBase, type CustomIconProps, LineWeights } from "..";

const LineIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={LineWeights} />
));

LineIcon.displayName = "LineIcon";
export { LineIcon };
