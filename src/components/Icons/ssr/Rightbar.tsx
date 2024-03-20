import { forwardRef } from "react";
import { CustomIconBase, type CustomIconProps, RightbarWeights } from "..";

const RightbarIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={RightbarWeights} />
	),
);

RightbarIcon.displayName = "RightbarIcon";
export { RightbarIcon };
