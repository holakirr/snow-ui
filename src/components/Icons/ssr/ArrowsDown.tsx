import type { CustomIconProps } from "@types";
import { forwardRef } from "react";
import { ArrowsDownWeights } from "../defs";
import { CustomIconBase } from "../lib";

const ArrowsDownIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={ArrowsDownWeights} />
	),
);

ArrowsDownIcon.displayName = "ArrowsDownIcon";
export { ArrowsDownIcon };
