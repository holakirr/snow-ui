import { forwardRef } from "react";
import { CustomIconBase, TextAWeights, type CustomIconProps } from "..";

export const TextAIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={TextAWeights} />
	),
);
