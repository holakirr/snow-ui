import { forwardRef } from "react";
import { ArrowLineRightWeights } from "../defs";
import { CustomIconBase } from "../lib";
import type { CustomIconProps } from "../types";

const ArrowLineRightIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={ArrowLineRightWeights} />
	),
);

ArrowLineRightIcon.displayName = "ArrowLineRightIcon";
export { ArrowLineRightIcon };
