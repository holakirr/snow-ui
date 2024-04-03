import { forwardRef } from "react";
import { RoundedCornerWeights } from "../defs";
import { CustomIconBase } from "../lib";
import type { CustomIconProps } from "../types";

const RoundedCornerIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={RoundedCornerWeights} />
	),
);

RoundedCornerIcon.displayName = "RoundedCornerIcon";
export { RoundedCornerIcon };
