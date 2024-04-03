import { forwardRef } from "react";
import { OneNoteWeights } from "../defs";
import { CustomIconBase } from "../lib";
import type { CustomIconProps } from "../types";

const OneNoteIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={OneNoteWeights} />
));

OneNoteIcon.displayName = "OneNoteIcon";
export { OneNoteIcon };
