import { forwardRef } from "react";
import { CustomIconBase, type CustomIconProps, ExplainWeights } from "..";

const ExplainIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={ExplainWeights} />
));

ExplainIcon.displayName = "ExplainIcon";
export { ExplainIcon };
