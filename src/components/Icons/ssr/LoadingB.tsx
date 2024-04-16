import { CustomIconBase, LoadingBWeights } from "@components";
import type { CustomIconProps } from "@utils";
import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

const LoadingBIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase
			ref={ref}
			{...props}
			weights={LoadingBWeights}
			className={twMerge("animate-loaderB", props.className)}
		/>
	),
);

LoadingBIcon.displayName = "LoadingBIcon";
export { LoadingBIcon };
