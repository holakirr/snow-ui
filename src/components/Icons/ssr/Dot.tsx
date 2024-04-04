import { forwardRef } from "react";
import type { CustomIconProps } from "../../../utils";
import { DotWeights } from "../defs";
import { CustomIconBase } from "../lib";

const DotIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={DotWeights} />
));

DotIcon.displayName = "DotIcon";
export { DotIcon };
