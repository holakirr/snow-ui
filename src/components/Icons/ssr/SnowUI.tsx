import { forwardRef } from "react";
import { CustomIconBase, SnowUIWeights, type CustomIconProps } from "..";

export const SnowUIIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={SnowUIWeights} />
	),
);
