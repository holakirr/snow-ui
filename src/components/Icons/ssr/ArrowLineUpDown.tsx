import type { CustomIconProps } from "@utils";
import { forwardRef } from "react";
import { ArrowLineUpDownWeights } from "../defs";
import { CustomIconBase } from "../lib";

const ArrowLineUpDownIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={ArrowLineUpDownWeights} />
	),
);

ArrowLineUpDownIcon.displayName = "ArrowLineUpDownIcon";
export { ArrowLineUpDownIcon };
