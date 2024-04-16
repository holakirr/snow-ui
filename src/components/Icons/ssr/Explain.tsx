import type { CustomIconProps } from "@utils";
import { forwardRef } from "react";
import { ExplainWeights } from "../defs";
import { CustomIconBase } from "../lib";

const ExplainIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={ExplainWeights} />
));

ExplainIcon.displayName = "ExplainIcon";
export { ExplainIcon };
