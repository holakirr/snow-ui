import { forwardRef } from "react";
import type { CustomIconProps } from "../../../utils";
import { AIWeights } from "../defs";
import { CustomIconBase } from "../lib";

const AIIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={AIWeights} />
));

AIIcon.displayName = "AIIcon";
export { AIIcon };
