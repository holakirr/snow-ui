import { CustomIconBase, RightbarWeights } from "@components";
import type { CustomIconProps } from "@types";
import { forwardRef } from "react";

const RightbarIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={RightbarWeights} />
	),
);

RightbarIcon.displayName = "RightbarIcon";
export { RightbarIcon };
