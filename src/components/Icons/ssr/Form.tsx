import { CustomIconBase, FormWeights } from "@components";
import type { CustomIconProps } from "@utils";
import { forwardRef } from "react";

const FormIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={FormWeights} />
));

FormIcon.displayName = "FormIcon";
export { FormIcon };
