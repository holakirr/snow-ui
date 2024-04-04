import { forwardRef } from "react";
import type { CustomIconProps } from "../../../utils";
import { DocXWeights } from "../defs";
import { CustomIconBase } from "../lib";

const DocXIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={DocXWeights} />
));

DocXIcon.displayName = "DocXIcon";
export { DocXIcon };
