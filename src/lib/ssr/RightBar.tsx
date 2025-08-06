import { RightBarWeights } from "../defs";
import { IconBase } from "../IconBase";
import type { Icon } from "../types";

const RightBarIcon: Icon = (props) => <IconBase {...props} weights={RightBarWeights} />;

RightBarIcon.displayName = "RightBarIcon";
export { RightBarIcon };
