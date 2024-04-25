import { CustomIconBase, SnowUIWeights } from "@components";
import type { CustomIconProps } from "@types";
import { forwardRef } from "react";

const SnowUIIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={SnowUIWeights} />
));

SnowUIIcon.displayName = "SnowUIIcon";
export { SnowUIIcon };
