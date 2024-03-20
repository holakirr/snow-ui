import { forwardRef } from "react";
import { CustomIconBase, XLSXWeights, type CustomIconProps } from "..";

export const XLSXIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => <CustomIconBase ref={ref} {...props} weights={XLSXWeights} />,
);
