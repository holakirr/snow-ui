import { XCircleWeights } from "../defs";
import { IconBase } from "../IconBase";
import type { Icon } from "../types";

const XCircleIcon: Icon = (props) => <IconBase {...props} weights={XCircleWeights} />;

XCircleIcon.displayName = "XCircleIcon";
export { XCircleIcon };
