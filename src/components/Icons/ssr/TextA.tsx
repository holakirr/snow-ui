import { forwardRef } from "react";
import { CustomIconBase, type CustomIconProps, TextAWeights } from "..";

const TextAIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={TextAWeights} />
));

TextAIcon.displayName = "TextAIcon";
export { TextAIcon };
