import type { CustomIconProps } from "@types";
import { forwardRef } from "react";
import { ArrowLineUpWeights } from "../defs";
import { CustomIconBase } from "../lib";

const ArrowLineUpIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={ArrowLineUpWeights} />
	),
);

ArrowLineUpIcon.displayName = "ArrowLineUpIcon";
export { ArrowLineUpIcon };
