import { forwardRef } from "react";
import { CloseWeights, CustomIconBase, type CustomIconProps } from "..";

export const CloseIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={CloseWeights} />
	),
);
