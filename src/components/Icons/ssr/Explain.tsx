import { CustomIconBase, ExplainWeights } from "@components";
import type { CustomIconProps } from "@types";
import { forwardRef } from "react";

const ExplainIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={ExplainWeights} />
));

ExplainIcon.displayName = "ExplainIcon";
export { ExplainIcon };
