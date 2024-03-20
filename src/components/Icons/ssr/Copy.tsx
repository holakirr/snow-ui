import { forwardRef } from "react";
import { CopyWeights, CustomIconBase, type CustomIconProps } from "..";

const CopyIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={CopyWeights} />
));

CopyIcon.displayName = "CopyIcon";
export { CopyIcon };
