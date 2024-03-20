import { forwardRef } from "react";
import { CustomIconBase, PPTWeights, type CustomIconProps } from "..";

export const PPTIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => <CustomIconBase ref={ref} {...props} weights={PPTWeights} />,
);
