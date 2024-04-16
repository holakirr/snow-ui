import { CustomIconBase, FourPointedStarWeights } from "@components";
import type { CustomIconProps } from "@utils";
import { forwardRef } from "react";

const FourPointedStarIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={FourPointedStarWeights} />
	),
);

FourPointedStarIcon.displayName = "FourPointedStarIcon";
export { FourPointedStarIcon };
