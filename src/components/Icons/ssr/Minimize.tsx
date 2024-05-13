import type { CustomIconProps } from "@types";
import { forwardRef } from "react";
import { MinimizeWeights } from "../defs";
import { CustomIconBase } from "../lib";

const MinimizeIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={MinimizeWeights} />
	),
);

MinimizeIcon.displayName = "MinimizeIcon";
export { MinimizeIcon };
