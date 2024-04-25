import { CustomIconBase, WindowedWeights } from "@components";
import type { CustomIconProps } from "@types";
import { forwardRef } from "react";

const WindowedIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={WindowedWeights} />
	),
);

WindowedIcon.displayName = "WindowedIcon";
export { WindowedIcon };
