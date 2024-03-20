import { forwardRef } from "react";
import { CustomIconBase, OneNoteWeights, type CustomIconProps } from "..";

export const OneNoteIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={OneNoteWeights} />
	),
);
