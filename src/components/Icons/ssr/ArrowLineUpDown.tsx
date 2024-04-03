import { forwardRef } from "react";
import { ArrowLineUpDownWeights } from "../defs";
import { CustomIconBase } from "../lib";
import type { CustomIconProps } from "../types";

const ArrowLineUpDownIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={ArrowLineUpDownWeights} />
	),
);

ArrowLineUpDownIcon.displayName = "ArrowLineUpDownIcon";
export { ArrowLineUpDownIcon };
