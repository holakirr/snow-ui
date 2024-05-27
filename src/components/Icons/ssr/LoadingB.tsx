import type { CustomIconProps } from "@types";
import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import { LoadingBWeights } from "../defs";
import { CustomIconBase } from "../lib";

const LoadingBIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase
		ref={ref}
		{...props}
		weights={LoadingBWeights}
		className={twMerge("animate-loaderB", props.className)}
	/>
));

LoadingBIcon.displayName = "LoadingBIcon";
export { LoadingBIcon };
