import { forwardRef } from "react";
import type { CustomIconProps } from "../../../utils";
import { PPTWeights } from "../defs";
import { CustomIconBase } from "../lib";

const PPTIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={PPTWeights} />
));

PPTIcon.displayName = "PPTIcon";
export { PPTIcon };
