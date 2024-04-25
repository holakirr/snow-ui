import { CustomIconBase, StarWeights } from "@components";
import type { CustomIconProps } from "@types";
import { forwardRef } from "react";

const StarIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={StarWeights} />
));

StarIcon.displayName = "StarIcon";
export { StarIcon };
