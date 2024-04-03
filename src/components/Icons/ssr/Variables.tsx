import { forwardRef } from "react";
import { VariablesWeights } from "../defs";
import { CustomIconBase } from "../lib";
import type { CustomIconProps } from "../types";

const VariablesIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={VariablesWeights} />
	),
);

VariablesIcon.displayName = "VariablesIcon";
export { VariablesIcon };
