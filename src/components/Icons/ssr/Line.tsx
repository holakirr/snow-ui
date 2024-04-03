import { forwardRef } from "react";
import { LineWeights } from "../defs";
import { CustomIconBase } from "../lib";
import type { CustomIconProps } from "../types";

const LineIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={LineWeights} />
));

LineIcon.displayName = "LineIcon";
export { LineIcon };
