import { CustomIconBase, HelpWeights } from "@components";
import type { CustomIconProps } from "@types";
import { forwardRef } from "react";

const HelpIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={HelpWeights} />
));

HelpIcon.displayName = "HelpIcon";
export { HelpIcon };
