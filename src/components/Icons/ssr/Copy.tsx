import { forwardRef } from "react";
import { CopyWeights } from "../defs";
import { CustomIconBase } from "../lib";
import type { CustomIconProps } from "../types";

const CopyIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={CopyWeights} />
));

CopyIcon.displayName = "CopyIcon";
export { CopyIcon };
