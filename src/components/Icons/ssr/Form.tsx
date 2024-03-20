import { forwardRef } from "react";
import { CustomIconBase, FormWeights, type CustomIconProps } from "..";

export const FormIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => <CustomIconBase ref={ref} {...props} weights={FormWeights} />,
);
