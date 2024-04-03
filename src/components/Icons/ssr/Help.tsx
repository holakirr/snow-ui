import { forwardRef } from "react";
import { HelpWeights } from "../defs";
import { CustomIconBase } from "../lib";
import type { CustomIconProps } from "../types";

const HelpIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={HelpWeights} />
));

HelpIcon.displayName = "HelpIcon";
export { HelpIcon };
