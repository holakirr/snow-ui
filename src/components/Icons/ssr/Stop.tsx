import { forwardRef } from "react";
import { CustomIconBase, StopWeights, type CustomIconProps } from "..";

export const StopIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => <CustomIconBase ref={ref} {...props} weights={StopWeights} />,
);
