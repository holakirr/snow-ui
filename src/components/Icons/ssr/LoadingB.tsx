import { forwardRef } from "react";
import { CustomIconBase, type CustomIconProps, LoadingBWeights } from "..";

const LoadingBIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase
			ref={ref}
			{...props}
			weights={LoadingBWeights}
			className="animate-loaderB"
		/>
	),
);

LoadingBIcon.displayName = "LoadingBIcon";
export { LoadingBIcon };
