import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import { CustomIconBase, type CustomIconProps, LoadingBWeights } from "..";

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
