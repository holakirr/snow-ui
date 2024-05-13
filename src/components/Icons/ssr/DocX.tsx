import type { CustomIconProps } from "@types";
import { forwardRef } from "react";
import { DocXWeights } from "../defs";
import { CustomIconBase } from "../lib";

const DocXIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={DocXWeights} />
));

DocXIcon.displayName = "DocXIcon";
export { DocXIcon };
