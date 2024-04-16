import { CustomIconBase, TextAWeights } from "@components";
import type { CustomIconProps } from "@utils";
import { forwardRef } from "react";

const TextAIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={TextAWeights} />
));

TextAIcon.displayName = "TextAIcon";
export { TextAIcon };
