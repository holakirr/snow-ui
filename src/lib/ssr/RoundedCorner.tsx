import { RoundedCornerWeights } from "../defs";
import { IconBase } from "../IconBase";
import type { Icon } from "../types";

const RoundedCornerIcon: Icon = (props) => <IconBase {...props} weights={RoundedCornerWeights} />;

RoundedCornerIcon.displayName = "RoundedCornerIcon";
export { RoundedCornerIcon };
