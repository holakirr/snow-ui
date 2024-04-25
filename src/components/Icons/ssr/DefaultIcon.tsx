import { CustomIconBase, DefaultIconWeights } from "@components";
import type { CustomIconProps } from "@types";
import { forwardRef } from "react";

const DefaultIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={DefaultIconWeights} />
));

DefaultIcon.displayName = "DefaultIcon";
export { DefaultIcon };
