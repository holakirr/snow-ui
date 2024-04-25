import { CustomIconBase, SearchWeights } from "@components";
import type { CustomIconProps } from "@types";
import { forwardRef } from "react";

const SearchIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={SearchWeights} />
));

SearchIcon.displayName = "SearchIcon";
export { SearchIcon };
