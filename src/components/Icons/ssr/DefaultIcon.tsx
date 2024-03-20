import { forwardRef } from "react";
import { CustomIconBase, type CustomIconProps, DefaultIconWeights } from "..";

const DefaultIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={DefaultIconWeights} />
));

DefaultIcon.displayName = "DefaultIcon";
export { DefaultIcon };
