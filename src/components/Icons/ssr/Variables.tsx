import { CustomIconBase, VariablesWeights } from "@components";
import type { CustomIconProps } from "@utils";
import { forwardRef } from "react";

const VariablesIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={VariablesWeights} />
	),
);

VariablesIcon.displayName = "VariablesIcon";
export { VariablesIcon };
