import { CustomIconBase, LineWeights } from "@components";
import type { CustomIconProps } from "@types";
import { forwardRef } from "react";

const LineIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={LineWeights} />
));

LineIcon.displayName = "LineIcon";
export { LineIcon };
