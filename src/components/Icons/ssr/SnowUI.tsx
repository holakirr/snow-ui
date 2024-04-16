import type { CustomIconProps } from "@utils";
import { forwardRef } from "react";
import { SnowUIWeights } from "../defs";
import { CustomIconBase } from "../lib";

const SnowUIIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={SnowUIWeights} />
));

SnowUIIcon.displayName = "SnowUIIcon";
export { SnowUIIcon };
