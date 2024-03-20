import { forwardRef } from "react";
import { CustomIconBase, type CustomIconProps, StarWeights } from "..";

const StarIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={StarWeights} />
));

StarIcon.displayName = "StarIcon";
export { StarIcon };
