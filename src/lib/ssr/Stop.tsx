import { StopWeights } from "../defs/Stop";
import { IconBase } from "../IconBase";
import type { Icon } from "../types";

const StopIcon: Icon = (props) => <IconBase {...props} weights={StopWeights} />;

export { StopIcon };
