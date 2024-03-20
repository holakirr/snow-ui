import { forwardRef } from "react";
import { CustomIconBase, type CustomIconProps, RoundedCornerWeights } from "..";

const RoundedCornerIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={RoundedCornerWeights} />
	),
);

RoundedCornerIcon.displayName = "RoundedCornerIcon";
export { RoundedCornerIcon };
