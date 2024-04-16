import type { CustomIconProps } from "@utils";
import { forwardRef } from "react";
import { HelpWeights } from "../defs";
import { CustomIconBase } from "../lib";

const HelpIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={HelpWeights} />
));

HelpIcon.displayName = "HelpIcon";
export { HelpIcon };
