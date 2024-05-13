import type { CustomIconProps } from "@types";
import { forwardRef } from "react";
import { TXTWeights } from "../defs";
import { CustomIconBase } from "../lib";

const TXTIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={TXTWeights} />
));

TXTIcon.displayName = "TXTIcon";
export { TXTIcon };
