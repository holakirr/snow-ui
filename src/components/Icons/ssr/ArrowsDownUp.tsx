import { forwardRef } from "react";
import { ArrowsDownUpWeights } from "../defs";
import { CustomIconBase } from "../lib";
import type { CustomIconProps } from "../types";

const ArrowsDownUpIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={ArrowsDownUpWeights} />
	),
);

ArrowsDownUpIcon.displayName = "ArrowsDownUpIcon";
export { ArrowsDownUpIcon };
