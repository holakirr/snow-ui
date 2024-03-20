import { forwardRef } from "react";
import { AIWeights, CustomIconBase, type CustomIconProps } from "..";

const AIIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={AIWeights} />
));

AIIcon.displayName = "AIIcon";
export { AIIcon };
