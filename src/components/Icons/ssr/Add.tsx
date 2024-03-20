import { forwardRef } from "react";
import { AddWeights, CustomIconBase, type CustomIconProps } from "..";

const AddIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={AddWeights} />
));

AddIcon.displayName = "AddIcon";
export { AddIcon };
