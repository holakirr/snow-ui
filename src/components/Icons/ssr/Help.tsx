import { forwardRef } from "react";
import { CustomIconBase, HelpWeights, type CustomIconProps } from "..";

export const HelpIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => <CustomIconBase ref={ref} {...props} weights={HelpWeights} />,
);
