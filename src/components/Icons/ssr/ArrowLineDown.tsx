import { ArrowLineDownWeights, CustomIconBase } from "@components";
import type { CustomIconProps } from "@types";
import { forwardRef } from "react";

const ArrowLineDownIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={ArrowLineDownWeights} />
	),
);

ArrowLineDownIcon.displayName = "ArrowLineDownIcon";
export { ArrowLineDownIcon };
