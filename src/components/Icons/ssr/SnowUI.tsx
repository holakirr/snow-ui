import { forwardRef } from "react";
import { CustomIconBase, type CustomIconProps, SnowUIWeights } from "..";

const SnowUIIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={SnowUIWeights} />
));

SnowUIIcon.displayName = "SnowUIIcon";
export { SnowUIIcon };
