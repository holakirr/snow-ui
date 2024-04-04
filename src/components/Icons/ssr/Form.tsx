import { forwardRef } from "react";
import type { CustomIconProps } from "../../../utils";
import { FormWeights } from "../defs";
import { CustomIconBase } from "../lib";

const FormIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={FormWeights} />
));

FormIcon.displayName = "FormIcon";
export { FormIcon };
