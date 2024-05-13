import type { CustomIconProps } from "@types";
import { forwardRef } from "react";
import { FormWeights } from "../defs";
import { CustomIconBase } from "../lib";

const FormIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={FormWeights} />
));

FormIcon.displayName = "FormIcon";
export { FormIcon };
