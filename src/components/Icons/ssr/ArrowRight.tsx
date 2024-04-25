import { ArrowRightWeights, CustomIconBase } from "@components";
import type { CustomIconProps } from "@types";
import { forwardRef } from "react";

const ArrowRightIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={ArrowRightWeights} />
	),
);

ArrowRightIcon.displayName = "ArrowRightIcon";
export { ArrowRightIcon };
