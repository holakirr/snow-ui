import { forwardRef } from "react";
import { CustomIconBase, ExplainWeights, type CustomIconProps } from "..";

export const ExplainIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={ExplainWeights} />
	),
);
