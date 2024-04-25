import { ArrowsUpWeights, CustomIconBase } from "@components";
import type { CustomIconProps } from "@types";
import { forwardRef } from "react";

const ArrowsUpIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={ArrowsUpWeights} />
	),
);

ArrowsUpIcon.displayName = "ArrowsUpIcon";
export { ArrowsUpIcon };
