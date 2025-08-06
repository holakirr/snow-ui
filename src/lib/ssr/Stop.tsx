import { StopWeights } from "../defs";
import { IconBase } from "../IconBase";
import type { Icon } from "../types";

const StopIcon: Icon = (props) => <IconBase {...props} weights={StopWeights} />;

StopIcon.displayName = "StopIcon";
export { StopIcon };
