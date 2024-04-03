import { forwardRef } from "react";
import { MinimizeWeights } from "../defs";
import { CustomIconBase } from "../lib";
import type { CustomIconProps } from "../types";

const MinimizeIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={MinimizeWeights} />
	),
);

MinimizeIcon.displayName = "MinimizeIcon";
export { MinimizeIcon };
