import { forwardRef } from "react";
import type { CustomIconProps } from "../../../utils";
import { HorizontalScreenWeights } from "../defs";
import { CustomIconBase } from "../lib";

const HorizontalScreenIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={HorizontalScreenWeights} />
	),
);

HorizontalScreenIcon.displayName = "HorizontalScreenIcon";
export { HorizontalScreenIcon };
