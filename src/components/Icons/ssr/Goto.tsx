import { forwardRef } from "react";
import type { CustomIconProps } from "../../../utils";
import { GotoWeights } from "../defs";
import { CustomIconBase } from "../lib";

const GotoIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={GotoWeights} />
));

GotoIcon.displayName = "GotoIcon";
export { GotoIcon };
