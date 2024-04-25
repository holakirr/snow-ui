import { CustomIconBase, MinimizeWeights } from "@components";
import type { CustomIconProps } from "@types";
import { forwardRef } from "react";

const MinimizeIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={MinimizeWeights} />
	),
);

MinimizeIcon.displayName = "MinimizeIcon";
export { MinimizeIcon };
