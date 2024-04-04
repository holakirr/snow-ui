import { forwardRef } from "react";
import type { CustomIconProps } from "../../../utils";
import { TXTWeights } from "../defs";
import { CustomIconBase } from "../lib";

const TXTIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={TXTWeights} />
));

TXTIcon.displayName = "TXTIcon";
export { TXTIcon };
