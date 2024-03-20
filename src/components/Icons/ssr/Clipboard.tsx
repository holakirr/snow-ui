import { forwardRef } from "react";
import { ClipboardWeights, CustomIconBase, type CustomIconProps } from "..";

export const ClipboardIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={ClipboardWeights} />
	),
);
