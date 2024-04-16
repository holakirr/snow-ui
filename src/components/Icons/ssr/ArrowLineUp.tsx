import { ArrowLineUpWeights, CustomIconBase } from "@components";
import type { CustomIconProps } from "@utils";
import { forwardRef } from "react";

const ArrowLineUpIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={ArrowLineUpWeights} />
	),
);

ArrowLineUpIcon.displayName = "ArrowLineUpIcon";
export { ArrowLineUpIcon };
