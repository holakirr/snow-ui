import { forwardRef } from "react";
import { WindowedWeights } from "../defs";
import { CustomIconBase } from "../lib";
import type { CustomIconProps } from "../types";

const WindowedIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={WindowedWeights} />
	),
);

WindowedIcon.displayName = "WindowedIcon";
export { WindowedIcon };
