import { CustomIconBase, RectangleWeights } from "@components";
import type { CustomIconProps } from "@types";
import { forwardRef } from "react";

const RectangleIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={RectangleWeights} />
	),
);

RectangleIcon.displayName = "RectangleIcon";
export { RectangleIcon };
