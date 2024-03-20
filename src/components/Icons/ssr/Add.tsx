import { forwardRef } from "react";
import { AddWeights, CustomIconBase, type CustomIconProps } from "..";

export const AddIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => <CustomIconBase ref={ref} {...props} weights={AddWeights} />,
);
