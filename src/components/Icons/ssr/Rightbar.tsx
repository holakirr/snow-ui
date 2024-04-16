import type { CustomIconProps } from "@utils";
import { forwardRef } from "react";
import { RightbarWeights } from "../defs";
import { CustomIconBase } from "../lib";

const RightbarIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={RightbarWeights} />
	),
);

RightbarIcon.displayName = "RightbarIcon";
export { RightbarIcon };
