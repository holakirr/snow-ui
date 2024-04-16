import { CustomIconBase, TXTWeights } from "@components";
import type { CustomIconProps } from "@utils";
import { forwardRef } from "react";

const TXTIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={TXTWeights} />
));

TXTIcon.displayName = "TXTIcon";
export { TXTIcon };
