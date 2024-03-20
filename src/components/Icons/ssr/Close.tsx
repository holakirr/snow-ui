import { forwardRef } from "react";
import { CloseWeights, CustomIconBase, type CustomIconProps } from "..";

const CloseIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={CloseWeights} />
));

CloseIcon.displayName = "CloseIcon";
export { CloseIcon };
