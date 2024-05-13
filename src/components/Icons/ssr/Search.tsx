import type { CustomIconProps } from "@types";
import { forwardRef } from "react";
import { SearchWeights } from "../defs";
import { CustomIconBase } from "../lib";

const SearchIcon = forwardRef<SVGSVGElement, CustomIconProps>((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={SearchWeights} />
));

SearchIcon.displayName = "SearchIcon";
export { SearchIcon };
