import { forwardRef } from "react";
import { CustomIconBase, type CustomIconProps, MinimizeWeights } from "..";

const MinimizeIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={MinimizeWeights} />
	),
);

MinimizeIcon.displayName = "MinimizeIcon";
export { MinimizeIcon };
