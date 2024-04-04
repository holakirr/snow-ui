import { forwardRef } from "react";
import type { CustomIconProps } from "../../../utils";
import { ArrowsDownWeights } from "../defs";
import { CustomIconBase } from "../lib";

const ArrowsDownIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={ArrowsDownWeights} />
	),
);

ArrowsDownIcon.displayName = "ArrowsDownIcon";
export { ArrowsDownIcon };
