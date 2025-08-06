import { PPTWeights } from "../defs";
import { IconBase } from "../IconBase";
import type { Icon } from "../types";

const PPTIcon: Icon = (props) => <IconBase {...props} weights={PPTWeights} />;

PPTIcon.displayName = "PPTIcon";
export { PPTIcon };
