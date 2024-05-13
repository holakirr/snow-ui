import type { CustomIconProps } from "@types";
import { forwardRef } from "react";
import { ArrowLineLeftWeights } from "../defs";
import { CustomIconBase } from "../lib";

const ArrowLineLeftIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={ArrowLineLeftWeights} />
	),
);

ArrowLineLeftIcon.displayName = "ArrowLineLeftIcon";
export { ArrowLineLeftIcon };
