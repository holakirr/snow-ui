import { ArrowLineLeftWeights, CustomIconBase } from "@components";
import type { CustomIconProps } from "@utils";
import { forwardRef } from "react";

const ArrowLineLeftIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={ArrowLineLeftWeights} />
	),
);

ArrowLineLeftIcon.displayName = "ArrowLineLeftIcon";
export { ArrowLineLeftIcon };
