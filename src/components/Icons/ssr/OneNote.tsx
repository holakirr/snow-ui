import { forwardRef } from "react";
import { CustomIconBase, type CustomIconProps, OneNoteWeights } from "..";

const OneNoteIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={OneNoteWeights} />
));

OneNoteIcon.displayName = "OneNoteIcon";
export { OneNoteIcon };
