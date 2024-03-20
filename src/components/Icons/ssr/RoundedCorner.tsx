import { forwardRef } from "react";
import { CustomIconBase, RoundedCornerWeights, type CustomIconProps } from "..";

export const RoundedCornerIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={RoundedCornerWeights} />
	),
);
