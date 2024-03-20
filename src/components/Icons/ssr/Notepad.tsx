import { forwardRef } from "react";
import { CustomIconBase, NotepadWeights, type CustomIconProps } from "..";

export const NotepadIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={NotepadWeights} />
	),
);
