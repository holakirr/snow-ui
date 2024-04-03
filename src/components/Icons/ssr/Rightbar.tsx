import { forwardRef } from "react";
import { RightbarWeights } from "../defs";
import { CustomIconBase } from "../lib";
import type { CustomIconProps } from "../types";

const RightbarIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={RightbarWeights} />
	),
);

RightbarIcon.displayName = "RightbarIcon";
export { RightbarIcon };
