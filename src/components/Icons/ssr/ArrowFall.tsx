import type { CustomIconProps } from "@utils";
import { forwardRef } from "react";
import { ArrowFallWeights } from "../defs";
import { CustomIconBase } from "../lib";

const ArrowFallIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={ArrowFallWeights} />
	),
);

ArrowFallIcon.displayName = "ArrowFallIcon";
export { ArrowFallIcon };
