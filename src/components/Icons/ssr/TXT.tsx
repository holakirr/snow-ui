import { forwardRef } from "react";
import { CustomIconBase, TXTWeights, type CustomIconProps } from "..";

export const TXTIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => <CustomIconBase ref={ref} {...props} weights={TXTWeights} />,
);
