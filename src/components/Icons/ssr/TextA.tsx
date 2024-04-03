import { forwardRef } from "react";
import { TextAWeights } from "../defs";
import { CustomIconBase } from "../lib";
import type { CustomIconProps } from "../types";

const TextAIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={TextAWeights} />
));

TextAIcon.displayName = "TextAIcon";
export { TextAIcon };
