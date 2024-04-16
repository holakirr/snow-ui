import { CustomIconBase, DocXWeights } from "@components";
import type { CustomIconProps } from "@utils";
import { forwardRef } from "react";

const DocXIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={DocXWeights} />
));

DocXIcon.displayName = "DocXIcon";
export { DocXIcon };
