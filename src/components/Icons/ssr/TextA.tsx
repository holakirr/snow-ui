import { forwardRef } from "react";
import type { CustomIconProps } from "../../../utils";
import { TextAWeights } from "../defs";
import { CustomIconBase } from "../lib";

const TextAIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={TextAWeights} />
));

TextAIcon.displayName = "TextAIcon";
export { TextAIcon };
