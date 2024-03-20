import { forwardRef } from "react";
import { CustomIconBase, GotoWeights, type CustomIconProps } from "..";

export const GotoIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => <CustomIconBase ref={ref} {...props} weights={GotoWeights} />,
);
