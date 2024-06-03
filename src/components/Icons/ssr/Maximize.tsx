import type { CustomIconProps } from "@types";
import { forwardRef } from "react";
import { MaximizeWeights } from "../defs";
import { CustomIconBase } from "../lib";

const MaximizeIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={MaximizeWeights} />
));

MaximizeIcon.displayName = "MaximizeIcon";
export { MaximizeIcon };
