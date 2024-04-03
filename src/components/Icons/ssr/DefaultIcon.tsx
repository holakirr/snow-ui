import { forwardRef } from "react";
import { DefaultIconWeights } from "../defs";
import { CustomIconBase } from "../lib";
import type { CustomIconProps } from "../types";

const DefaultIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={DefaultIconWeights} />
));

DefaultIcon.displayName = "DefaultIcon";
export { DefaultIcon };
