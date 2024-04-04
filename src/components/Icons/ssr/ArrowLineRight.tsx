import { forwardRef } from "react";
import type { CustomIconProps } from "../../../utils";
import { ArrowLineRightWeights } from "../defs";
import { CustomIconBase } from "../lib";

const ArrowLineRightIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={ArrowLineRightWeights} />
	),
);

ArrowLineRightIcon.displayName = "ArrowLineRightIcon";
export { ArrowLineRightIcon };
