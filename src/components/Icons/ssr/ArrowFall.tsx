import { ArrowFallWeights, CustomIconBase } from "@components";
import type { CustomIconProps } from "@utils";
import { forwardRef } from "react";

const ArrowFallIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={ArrowFallWeights} />
	),
);

ArrowFallIcon.displayName = "ArrowFallIcon";
export { ArrowFallIcon };
