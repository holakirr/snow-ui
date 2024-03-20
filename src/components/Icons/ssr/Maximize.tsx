import { forwardRef } from "react";
import { CustomIconBase, type CustomIconProps, MaximizeWeights } from "..";

const MaximizeIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={MaximizeWeights} />
	),
);

MaximizeIcon.displayName = "MaximizeIcon";
export { MaximizeIcon };
