import { CustomIconBase, GotoWeights } from "@components";
import type { CustomIconProps } from "@types";
import { forwardRef } from "react";

const GotoIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={GotoWeights} />
));

GotoIcon.displayName = "GotoIcon";
export { GotoIcon };
