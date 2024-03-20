import { forwardRef } from "react";
import { CopyWeights, CustomIconBase, type CustomIconProps } from "..";

export const CopyIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => <CustomIconBase ref={ref} {...props} weights={CopyWeights} />,
);
