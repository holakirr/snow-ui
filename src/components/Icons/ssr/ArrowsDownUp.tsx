import type { CustomIconProps } from "@types";
import { forwardRef } from "react";
import { ArrowsDownUpWeights } from "../defs";
import { CustomIconBase } from "../lib";

const ArrowsDownUpIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={ArrowsDownUpWeights} />
	),
);

ArrowsDownUpIcon.displayName = "ArrowsDownUpIcon";
export { ArrowsDownUpIcon };
