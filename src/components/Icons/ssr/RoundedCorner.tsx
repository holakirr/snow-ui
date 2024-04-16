import type { CustomIconProps } from "@utils";
import { forwardRef } from "react";
import { RoundedCornerWeights } from "../defs";
import { CustomIconBase } from "../lib";

const RoundedCornerIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={RoundedCornerWeights} />
	),
);

RoundedCornerIcon.displayName = "RoundedCornerIcon";
export { RoundedCornerIcon };
