import { forwardRef } from "react";
import { CustomIconBase, type CustomIconProps, SearchWeights } from "..";

const SearchIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={SearchWeights} />
));

SearchIcon.displayName = "SearchIcon";
export { SearchIcon };
