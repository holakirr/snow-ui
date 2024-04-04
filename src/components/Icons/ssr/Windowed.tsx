import { forwardRef } from "react";
import type { CustomIconProps } from "../../../utils";
import { WindowedWeights } from "../defs";
import { CustomIconBase } from "../lib";

const WindowedIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={WindowedWeights} />
	),
);

WindowedIcon.displayName = "WindowedIcon";
export { WindowedIcon };
