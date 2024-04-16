import { ArrowLineUpDownWeights, CustomIconBase } from "@components";
import type { CustomIconProps } from "@utils";
import { forwardRef } from "react";

const ArrowLineUpDownIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={ArrowLineUpDownWeights} />
	),
);

ArrowLineUpDownIcon.displayName = "ArrowLineUpDownIcon";
export { ArrowLineUpDownIcon };
