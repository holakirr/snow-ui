import { forwardRef } from "react";
import { SnowUIWeights } from "../defs";
import { CustomIconBase } from "../lib";
import type { CustomIconProps } from "../types";

const SnowUIIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={SnowUIWeights} />
));

SnowUIIcon.displayName = "SnowUIIcon";
export { SnowUIIcon };
