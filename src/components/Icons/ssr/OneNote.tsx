import { CustomIconBase, OneNoteWeights } from "@components";
import type { CustomIconProps } from "@types";
import { forwardRef } from "react";

const OneNoteIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={OneNoteWeights} />
));

OneNoteIcon.displayName = "OneNoteIcon";
export { OneNoteIcon };
