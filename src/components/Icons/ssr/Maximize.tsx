import { CustomIconBase, MaximizeWeights } from "@components";
import type { CustomIconProps } from "@utils";
import { forwardRef } from "react";

const MaximizeIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={MaximizeWeights} />
	),
);

MaximizeIcon.displayName = "MaximizeIcon";
export { MaximizeIcon };
