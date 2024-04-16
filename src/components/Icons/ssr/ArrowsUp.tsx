import type { CustomIconProps } from "@utils";
import { forwardRef } from "react";
import { ArrowsUpWeights } from "../defs";
import { CustomIconBase } from "../lib";

const ArrowsUpIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={ArrowsUpWeights} />
	),
);

ArrowsUpIcon.displayName = "ArrowsUpIcon";
export { ArrowsUpIcon };
