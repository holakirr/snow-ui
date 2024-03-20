import { forwardRef } from "react";
import { CustomIconBase, type CustomIconProps, NotepadWeights } from "..";

const NotepadIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={NotepadWeights} />
));

NotepadIcon.displayName = "NotepadIcon";
export { NotepadIcon };
