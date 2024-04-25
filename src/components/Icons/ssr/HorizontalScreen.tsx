import { CustomIconBase, HorizontalScreenWeights } from "@components";
import type { CustomIconProps } from "@types";
import { forwardRef } from "react";

const HorizontalScreenIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={HorizontalScreenWeights} />
	),
);

HorizontalScreenIcon.displayName = "HorizontalScreenIcon";
export { HorizontalScreenIcon };
