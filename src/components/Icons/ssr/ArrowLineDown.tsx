import { forwardRef } from "react";
import type { CustomIconProps } from "../../../utils";
import { ArrowLineDownWeights } from "../defs";
import { CustomIconBase } from "../lib";

const ArrowLineDownIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={ArrowLineDownWeights} />
	),
);

ArrowLineDownIcon.displayName = "ArrowLineDownIcon";
export { ArrowLineDownIcon };
