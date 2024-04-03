import { forwardRef } from "react";
import { FormWeights } from "../defs";
import { CustomIconBase } from "../lib";
import type { CustomIconProps } from "../types";

const FormIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={FormWeights} />
));

FormIcon.displayName = "FormIcon";
export { FormIcon };
