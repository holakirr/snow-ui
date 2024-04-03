import { forwardRef } from "react";
import { RectangleWeights } from "../defs";
import { CustomIconBase } from "../lib";
import type { CustomIconProps } from "../types";

const RectangleIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={RectangleWeights} />
	),
);

RectangleIcon.displayName = "RectangleIcon";
export { RectangleIcon };
