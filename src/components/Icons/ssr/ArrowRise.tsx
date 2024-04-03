import { forwardRef } from "react";
import { ArrowRiseWeights } from "../defs";
import { CustomIconBase } from "../lib";
import type { CustomIconProps } from "../types";

const ArrowRiseIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={ArrowRiseWeights} />
	),
);

ArrowRiseIcon.displayName = "ArrowRiseIcon";
export { ArrowRiseIcon };
