import { forwardRef } from "react";
import { AIWeights, CustomIconBase, type CustomIconProps } from "..";

export const AIIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => <CustomIconBase ref={ref} {...props} weights={AIWeights} />,
);
