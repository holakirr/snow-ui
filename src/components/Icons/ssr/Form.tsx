import { forwardRef } from "react";
import { CustomIconBase, type CustomIconProps, FormWeights } from "..";

const FormIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={FormWeights} />
));

FormIcon.displayName = "FormIcon";
export { FormIcon };
