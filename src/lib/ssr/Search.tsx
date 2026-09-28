import { SearchWeights } from "../defs/Search";
import { IconBase } from "../IconBase";
import type { Icon } from "../types";

const SearchIcon: Icon = (props) => <IconBase {...props} weights={SearchWeights} />;

export { SearchIcon };
