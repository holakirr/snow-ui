import { forwardRef } from "react";
import { CustomIconBase, SearchWeights, type CustomIconProps } from "..";

export const SearchIcon = forwardRef<SVGSVGElement, CustomIconProps>(
	(props, ref) => (
		<CustomIconBase ref={ref} {...props} weights={SearchWeights} />
	),
);
