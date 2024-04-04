import { forwardRef } from "react";
import type { CustomIconProps } from "../../../utils";
import { ArrowRightWeights } from "../defs";
import { CustomIconBase } from "../lib";

const ArrowRightIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={ArrowRightWeights} />
	),
);

ArrowRightIcon.displayName = "ArrowRightIcon";
export { ArrowRightIcon };
