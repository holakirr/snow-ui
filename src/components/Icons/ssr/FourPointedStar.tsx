import { forwardRef } from "react";
import { FourPointedStarWeights } from "../defs";
import { CustomIconBase } from "../lib";
import type { CustomIconProps } from "../types";

const FourPointedStarIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={FourPointedStarWeights} />
	),
);

FourPointedStarIcon.displayName = "FourPointedStarIcon";
export { FourPointedStarIcon };
