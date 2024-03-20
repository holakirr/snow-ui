import { forwardRef } from "react";
import { CustomIconBase, type CustomIconProps, DotWeights } from "..";

const DotIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={DotWeights} />
));

DotIcon.displayName = "DotIcon";
export { DotIcon };
