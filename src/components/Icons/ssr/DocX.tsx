import { forwardRef } from "react";
import { CustomIconBase, type CustomIconProps, DocXWeights } from "..";

const DocXIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={DocXWeights} />
));

DocXIcon.displayName = "DocXIcon";
export { DocXIcon };
