import { forwardRef } from "react";
import { ClipboardWeights } from "../defs";
import { CustomIconBase } from "../lib";
import type { CustomIconProps } from "../types";

const ClipboardIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={ClipboardWeights} />
	),
);

ClipboardIcon.displayName = "ClipboardIcon";
export { ClipboardIcon };
