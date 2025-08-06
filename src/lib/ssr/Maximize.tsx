import { MaximizeWeights } from "../defs";
import { IconBase } from "../IconBase";
import type { Icon } from "../types";

const MaximizeIcon: Icon = (props) => <IconBase {...props} weights={MaximizeWeights} />;

MaximizeIcon.displayName = "MaximizeIcon";
export { MaximizeIcon };
