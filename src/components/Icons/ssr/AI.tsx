import type { CustomIconProps } from "@types";
import { forwardRef } from "react";
import { AIWeights } from "../defs";
import { CustomIconBase } from "../lib";

const AIIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={AIWeights} />
));

AIIcon.displayName = "AIIcon";
export { AIIcon };
