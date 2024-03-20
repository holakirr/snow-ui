import { forwardRef } from "react";
import { ClipboardWeights, CustomIconBase, type CustomIconProps } from "..";

const ClipboardIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={ClipboardWeights} />
	),
);

ClipboardIcon.displayName = "ClipboardIcon";
export { ClipboardIcon };
