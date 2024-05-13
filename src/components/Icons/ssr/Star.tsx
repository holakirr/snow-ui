import type { CustomIconProps } from "@types";
import { forwardRef } from "react";
import { StarWeights } from "../defs";
import { CustomIconBase } from "../lib";

const StarIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={StarWeights} />
));

StarIcon.displayName = "StarIcon";
export { StarIcon };
