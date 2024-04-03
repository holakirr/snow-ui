import { forwardRef } from "react";
import { GotoWeights } from "../defs";
import { CustomIconBase } from "../lib";
import type { CustomIconProps } from "../types";

const GotoIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={GotoWeights} />
));

GotoIcon.displayName = "GotoIcon";
export { GotoIcon };
