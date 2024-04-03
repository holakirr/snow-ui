import { forwardRef } from "react";
import { ArrowFallWeights } from "../defs";
import { CustomIconBase } from "../lib";
import type { CustomIconProps } from "../types";

const ArrowFallIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={ArrowFallWeights} />
	),
);

ArrowFallIcon.displayName = "ArrowFallIcon";
export { ArrowFallIcon };
