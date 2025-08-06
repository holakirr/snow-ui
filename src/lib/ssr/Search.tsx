import { SearchWeights } from "../defs";
import { IconBase } from "../IconBase";
import type { Icon } from "../types";

const SearchIcon: Icon = (props) => <IconBase {...props} weights={SearchWeights} />;

SearchIcon.displayName = "SearchIcon";
export { SearchIcon };
