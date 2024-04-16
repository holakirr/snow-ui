import type { CustomIconProps } from "@utils";
import { forwardRef } from "react";
import { AddWeights } from "../defs";
import { CustomIconBase } from "../lib";

const AddIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={AddWeights} />
));

AddIcon.displayName = "AddIcon";
export { AddIcon };
