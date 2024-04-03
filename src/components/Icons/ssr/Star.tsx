import { forwardRef } from "react";
import { StarWeights } from "../defs";
import { CustomIconBase } from "../lib";
import type { CustomIconProps } from "../types";

const StarIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={StarWeights} />
));

StarIcon.displayName = "StarIcon";
export { StarIcon };
