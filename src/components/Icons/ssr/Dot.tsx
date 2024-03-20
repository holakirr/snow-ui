import { forwardRef } from "react";
import { CustomIconBase, DotWeights, type CustomIconProps } from "..";

export const DotIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => <CustomIconBase ref={ref} {...props} weights={DotWeights} />,
);
