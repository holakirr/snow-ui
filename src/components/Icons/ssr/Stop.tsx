import type { CustomIcon } from "../../../types";
import { StopWeights } from "../defs";
import { CustomIconBase } from "../lib";

const StopIcon: CustomIcon = (props) => <CustomIconBase {...props} weights={StopWeights} />;

StopIcon.displayName = "StopIcon";
export { StopIcon };
