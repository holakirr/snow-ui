import { CustomIconBase, RoundedCornerWeights } from "@components";
import type { CustomIconProps } from "@types";
import { forwardRef } from "react";

const RoundedCornerIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={RoundedCornerWeights} />
	),
);

RoundedCornerIcon.displayName = "RoundedCornerIcon";
export { RoundedCornerIcon };
