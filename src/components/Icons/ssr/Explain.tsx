import { forwardRef } from "react";
import { ExplainWeights } from "../defs";
import { CustomIconBase } from "../lib";
import type { CustomIconProps } from "../types";

const ExplainIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={ExplainWeights} />
));

ExplainIcon.displayName = "ExplainIcon";
export { ExplainIcon };
