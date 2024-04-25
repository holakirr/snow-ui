import { CustomIconBase, VerticalScreenWeights } from "@components";
import type { CustomIconProps } from "@types";
import { forwardRef } from "react";

const VerticalScreenIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={VerticalScreenWeights} />
	),
);

VerticalScreenIcon.displayName = "VerticalScreenIcon";
export { VerticalScreenIcon };
