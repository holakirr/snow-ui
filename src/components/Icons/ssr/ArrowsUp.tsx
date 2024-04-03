import { forwardRef } from "react";
import { ArrowsUpWeights } from "../defs";
import { CustomIconBase } from "../lib";
import type { CustomIconProps } from "../types";

const ArrowsUpIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={ArrowsUpWeights} />
	),
);

ArrowsUpIcon.displayName = "ArrowsUpIcon";
export { ArrowsUpIcon };
