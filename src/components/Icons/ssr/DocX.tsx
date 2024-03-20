import { forwardRef } from "react";
import { CustomIconBase, DocXWeights, type CustomIconProps } from "..";

export const DocXIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => <CustomIconBase ref={ref} {...props} weights={DocXWeights} />,
);
