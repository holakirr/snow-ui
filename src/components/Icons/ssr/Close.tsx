import { CloseWeights, CustomIconBase } from "@components";
import type { CustomIconProps } from "@types";
import { forwardRef } from "react";

const CloseIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={CloseWeights} />
));

CloseIcon.displayName = "CloseIcon";
export { CloseIcon };
