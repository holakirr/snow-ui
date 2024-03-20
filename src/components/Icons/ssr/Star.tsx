import { forwardRef } from "react";
import { CustomIconBase, StarWeights, type CustomIconProps } from "..";

export const StarIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => <CustomIconBase ref={ref} {...props} weights={StarWeights} />,
);
