import { forwardRef } from "react";
import { CustomIconBase, DefaultIconWeights, type CustomIconProps } from "..";

export const DefaultIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={DefaultIconWeights} />
	),
);
