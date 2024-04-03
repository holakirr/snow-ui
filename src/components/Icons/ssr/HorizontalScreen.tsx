import { forwardRef } from "react";
import { HorizontalScreenWeights } from "../defs";
import { CustomIconBase } from "../lib";
import type { CustomIconProps } from "../types";

const HorizontalScreenIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={HorizontalScreenWeights} />
	),
);

HorizontalScreenIcon.displayName = "HorizontalScreenIcon";
export { HorizontalScreenIcon };
