import { forwardRef } from "react";
import type { CustomIconProps } from "../../../utils";
import { FourPointedStarWeights } from "../defs";
import { CustomIconBase } from "../lib";

const FourPointedStarIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={FourPointedStarWeights} />
	),
);

FourPointedStarIcon.displayName = "FourPointedStarIcon";
export { FourPointedStarIcon };
