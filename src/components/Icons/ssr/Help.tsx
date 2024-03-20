import { forwardRef } from "react";
import { CustomIconBase, type CustomIconProps, HelpWeights } from "..";

const HelpIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={HelpWeights} />
));

HelpIcon.displayName = "HelpIcon";
export { HelpIcon };
