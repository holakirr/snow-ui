import type { CustomIcon } from "../../../types";
import { SearchWeights } from "../defs";
import { CustomIconBase } from "../lib";

const SearchIcon: CustomIcon = (props) => <CustomIconBase {...props} weights={SearchWeights} />;

SearchIcon.displayName = "SearchIcon";
export { SearchIcon };
