import { forwardRef } from "react";
import { CustomIconBase, VariablesWeights, type CustomIconProps } from "..";

export const VariablesIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={VariablesWeights} />
	),
);
