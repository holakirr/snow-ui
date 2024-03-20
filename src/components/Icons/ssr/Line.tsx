import { forwardRef } from "react";
import { CustomIconBase, LineWeights, type CustomIconProps } from "..";

export const LineIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => <CustomIconBase ref={ref} {...props} weights={LineWeights} />,
);
