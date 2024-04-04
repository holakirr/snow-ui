import { forwardRef } from "react";
import type { CustomIconProps } from "../../../utils";
import { ClipboardWeights } from "../defs";
import { CustomIconBase } from "../lib";

const ClipboardIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={ClipboardWeights} />
	),
);

ClipboardIcon.displayName = "ClipboardIcon";
export { ClipboardIcon };
