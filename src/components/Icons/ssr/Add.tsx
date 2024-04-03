import { forwardRef } from "react";
import { AddWeights } from "../defs";
import { CustomIconBase } from "../lib";
import type { CustomIconProps } from "../types";

const AddIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={AddWeights} />
));

AddIcon.displayName = "AddIcon";
export { AddIcon };
