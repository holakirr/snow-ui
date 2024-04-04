import { forwardRef } from "react";
import type { CustomIconProps } from "../../../utils";
import { RectangleWeights } from "../defs";
import { CustomIconBase } from "../lib";

const RectangleIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={RectangleWeights} />
	),
);

RectangleIcon.displayName = "RectangleIcon";
export { RectangleIcon };
