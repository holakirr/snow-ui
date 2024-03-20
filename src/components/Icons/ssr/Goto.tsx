import { forwardRef } from "react";
import { CustomIconBase, type CustomIconProps, GotoWeights } from "..";

const GotoIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={GotoWeights} />
));

GotoIcon.displayName = "GotoIcon";
export { GotoIcon };
