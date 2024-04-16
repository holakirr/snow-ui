import type { CustomIconProps } from "@utils";
import { forwardRef } from "react";
import { VerticalScreenWeights } from "../defs";
import { CustomIconBase } from "../lib";

const VerticalScreenIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={VerticalScreenWeights} />
	),
);

VerticalScreenIcon.displayName = "VerticalScreenIcon";
export { VerticalScreenIcon };
